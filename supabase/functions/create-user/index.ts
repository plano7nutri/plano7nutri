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

    const { email, password, phone, metadata, admin_secret } = await req.json()

    const MASTER_PASSWORD = Deno.env.get('ADMIN_MASTER_PASSWORD');
    
    if (!admin_secret || admin_secret !== MASTER_PASSWORD) {
      console.error("[create-user] Tentativa de acesso com senha mestre inválida.");
      return new Response(JSON.stringify({ error: "Acesso Negado: Senha Administrativa Inválida." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: requester } } = await supabaseAdmin.auth.getUser(token)
      
      if (requester && requester.email !== ADMIN_EMAIL) {
        return new Response(JSON.stringify({ error: "Acesso Negado: Apenas o administrador pode realizar esta ação via interface." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        })
      }
    }

    console.log("[create-user] Criando usuário via API/Painel:", email);

    // Criar Usuário no Auth com metadados completos
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone: phone ? (phone.startsWith('+') ? phone : "+" + phone.replace(/\D/g, "")) : undefined,
      user_metadata: {
        ...metadata,
        full_name: metadata.nome || metadata.full_name // Garante que o Supabase reconheça o Display Name
      },
      email_confirm: true,
      phone_confirm: true
    })

    if (authError) throw authError

    const cleanPhone = metadata.whatsapp || (phone ? phone.replace(/\D/g, "") : "");

    const { error: updateError } = await supabaseAdmin
      .from('clientes_pagos')
      .update({
        whatsapp: cleanPhone,
        telefone_cadastro: cleanPhone,
        nome_usuario: metadata.nome,
        tipo_assinatura: metadata.tipo_assinatura || 'Unica',
        plano_semanal: metadata.plano_semanal || false
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
    console.error("[create-user] Erro crítico:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})