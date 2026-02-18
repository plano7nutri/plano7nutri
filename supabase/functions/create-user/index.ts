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

    const fullName = body.nome || metadata?.nome || body.full_name || metadata?.full_name || "Usuário Elite";
    
    let rawPhone = (phone || body.Phone || metadata?.whatsapp || "").replace(/\D/g, "");
    if ((rawPhone.length === 10 || rawPhone.length === 11) && !rawPhone.startsWith("55")) {
      rawPhone = "55" + rawPhone;
    }
    const cleanPhone = rawPhone;

    const tipoAssinatura = metadata?.tipo_assinatura || body.tipo_assinatura || 'Unica';
    const planoSemanal = metadata?.plano_semanal || body.plano_semanal || false;
    const assinaturaAtiva = metadata?.assinatura_ativa !== undefined ? metadata.assinatura_ativa : true;

    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    const existingUser = users.find(u => u.email === email);
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          full_name: fullName,
          nome: fullName,
          whatsapp: cleanPhone,
          tipo_assinatura: tipoAssinatura,
          plano_semanal: planoSemanal,
          assinatura_ativa: assinaturaAtiva
        }
      });
      if (updateAuthError) throw updateAuthError;
    } else {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        phone: cleanPhone ? "+" + cleanPhone : undefined,
        user_metadata: {
          full_name: fullName,
          nome: fullName,
          whatsapp: cleanPhone,
          tipo_assinatura: tipoAssinatura,
          plano_semanal: planoSemanal,
          assinatura_ativa: assinaturaAtiva
        },
        email_confirm: true,
        phone_confirm: true
      });
      if (authError) throw authError;
      userId = authData.user.id;
    }

    const { error: dbError } = await supabaseAdmin
      .from('clientes_pagos')
      .upsert({
        id: userId,
        nome: fullName,
        nome_usuario: fullName,
        whatsapp: cleanPhone,
        telefone_cadastro: cleanPhone,
        tipo_assinatura: tipoAssinatura,
        plano_semanal: planoSemanal,
        assinatura_ativa: assinaturaAtiva,
        limite_cardapio_unico: 0
      }, { onConflict: 'id' });

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ 
      status: "success", 
      userId, 
      whatsapp_gravado: cleanPhone 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})