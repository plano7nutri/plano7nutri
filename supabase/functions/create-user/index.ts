import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, phone, metadata, admin_secret } = await req.json()

    // Validação da Senha Administrativa
    const MASTER_PASSWORD = Deno.env.get('ADMIN_MASTER_PASSWORD');
    
    if (!admin_secret || admin_secret !== MASTER_PASSWORD) {
      console.error("[create-user] Tentativa de acesso não autorizado.");
      return new Response(JSON.stringify({ error: "Acesso Negado: Senha Administrativa Inválida." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    console.log("[create-user] Criando usuário:", email);

    // 1. Criar Usuário no Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone,
      user_metadata: metadata,
      email_confirm: true,
      phone_confirm: true
    })

    if (authError) throw authError

    // 2. Padronizar dados na tabela clientes_pagos
    const cleanPhone = metadata.whatsapp || phone.replace(/\D/g, "");

    const { error: updateError } = await supabaseAdmin
      .from('clientes_pagos')
      .update({
        whatsapp: cleanPhone,
        telefone_cadastro: cleanPhone,
        nome_usuario: metadata.nome,
        tipo_assinatura: metadata.tipo_assinatura || 'Unica'
      })
      .eq('id', authData.user.id);

    if (updateError) {
      console.warn("[create-user] Aviso: Erro ao atualizar campos adicionais:", updateError.message);
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