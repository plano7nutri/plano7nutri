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

  const functionName = "create-user";
  console.log(`[${functionName}] Processando solicitação.`);

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { email, password, admin_secret, user_metadata, metadata } = body

    if (!email) throw new Error("E-mail é obrigatório.");

    const MASTER_PASSWORD = Deno.env.get('ADMIN_MASTER_PASSWORD');
    if (!admin_secret || admin_secret !== MASTER_PASSWORD) {
      return new Response(JSON.stringify({ error: "Senha Administrativa Inválida." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const finalMetadata = { ...metadata, ...user_metadata };
    const fullName = body.nome || finalMetadata?.nome || finalMetadata?.full_name || "Usuário Elite";
    
    // Mantém apenas os dígitos, sem adicionar prefixos ou forçar o 9
    let rawPhone = (body.phone || finalMetadata?.whatsapp || "").replace(/\D/g, "");

    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    const existingUser = users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase());
    let userId;

    if (existingUser) {
      console.log(`[${functionName}] Usuário encontrado. Atualizando metadados.`);
      userId = existingUser.id;
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...existingUser.user_metadata,
          ...finalMetadata,
          full_name: fullName,
          nome: fullName,
          whatsapp: rawPhone
        }
      });
      if (updateAuthError) throw updateAuthError;
    } else {
      console.log(`[${functionName}] Criando novo usuário.`);
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password: password || email.trim().toLowerCase(),
        email_confirm: true,
        user_metadata: {
          ...finalMetadata,
          full_name: fullName,
          nome: fullName,
          whatsapp: rawPhone
        }
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
        whatsapp: rawPhone,
        telefone_cadastro: rawPhone,
        email: email.trim().toLowerCase(),
        tipo_assinatura: finalMetadata?.tipo_assinatura ?? null,
        plano_semanal: finalMetadata?.plano_semanal ?? null,
        assinatura_ativa: finalMetadata?.assinatura_ativa !== undefined ? finalMetadata.assinatura_ativa : true,
        limite_cardapio_unico: 0
      }, { onConflict: 'id' });

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ status: "success", userId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error(`[${functionName}] Erro:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})