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

    const body = await req.json()
    const { email, password, phone, admin_secret, metadata } = body

    const MASTER_PASSWORD = Deno.env.get('ADMIN_MASTER_PASSWORD');
    
    if (!admin_secret || admin_secret !== MASTER_PASSWORD) {
      return new Response(JSON.stringify({ error: "Senha Administrativa Inválida." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Captura o nome de qualquer lugar possível no JSON
    const fullName = body.full_name || metadata?.full_name || metadata?.nome || body.nome || "Usuário Elite";
    const cleanPhone = (phone || body.Phone || metadata?.whatsapp || "").replace(/\D/g, "");

    console.log(`[create-user] Cadastrando: ${email} | Nome: ${fullName}`);

    // Criar Usuário no Auth
    // O segredo é garantir que full_name esteja no primeiro nível do user_metadata
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone: cleanPhone ? "+" + cleanPhone : undefined,
      user_metadata: {
        full_name: fullName, // O Supabase Auth usa este campo para o Display Name
        nome: fullName,
        whatsapp: cleanPhone,
        tipo_assinatura: metadata?.tipo_assinatura || body.tipo_assinatura || 'Unica',
        plano_semanal: metadata?.plano_semanal || body.plano_semanal || false
      },
      email_confirm: true,
      phone_confirm: true
    })

    if (authError) throw authError

    // Atualiza a tabela de clientes_pagos
    const { error: updateError } = await supabaseAdmin
      .from('clientes_pagos')
      .update({
        whatsapp: cleanPhone,
        telefone_cadastro: cleanPhone,
        nome_usuario: fullName,
        nome: fullName,
        tipo_assinatura: metadata?.tipo_assinatura || body.tipo_assinatura || 'Unica',
        plano_semanal: metadata?.plano_semanal || body.plano_semanal || false
      })
      .eq('id', authData.user.id);

    if (updateError) console.error("[create-user] Erro ao atualizar tabela:", updateError.message);

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