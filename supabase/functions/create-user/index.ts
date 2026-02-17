import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ADMIN_EMAIL = "robson_cruz@live.com";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    
    // Captura os dados exatamente como no seu JSON
    const email = body.email;
    const password = body.password;
    const admin_secret = body.admin_secret;
    const fullName = body.full_name; // Captura o nome do seu JSON
    const rawPhone = body.Phone;    // Captura o Phone com P maiúsculo do seu JSON

    const MASTER_PASSWORD = Deno.env.get('ADMIN_MASTER_PASSWORD');
    
    if (!admin_secret || admin_secret !== MASTER_PASSWORD) {
      console.error("[create-user] Senha mestre inválida.");
      return new Response(JSON.stringify({ error: "Senha Administrativa Inválida." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    console.log("[create-user] Criando usuário:", email, "| Nome:", fullName);

    // Criar Usuário no Auth do Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone: rawPhone ? (rawPhone.startsWith('+') ? rawPhone : "+" + rawPhone.replace(/\D/g, "")) : undefined,
      user_metadata: {
        full_name: fullName, // Isso preenche o "Display Name" na lista de usuários
        nome: fullName,
        whatsapp: rawPhone ? rawPhone.replace(/\D/g, "") : undefined
      },
      email_confirm: true,
      phone_confirm: true
    })

    if (authError) throw authError

    const cleanPhone = rawPhone ? rawPhone.replace(/\D/g, "") : "";

    // Atualiza a tabela de clientes_pagos com o nome e telefone
    const { error: updateError } = await supabaseAdmin
      .from('clientes_pagos')
      .update({
        whatsapp: cleanPhone,
        telefone_cadastro: cleanPhone,
        nome_usuario: fullName,
        nome: fullName,
        tipo_assinatura: body.tipo_assinatura || 'Unica',
        plano_semanal: body.plano_semanal || false
      })
      .eq('id', authData.user.id);

    if (updateError) {
      console.warn("[create-user] Erro ao atualizar tabela:", updateError.message);
    }

    return new Response(JSON.stringify(authData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error("[create-user] Erro:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})