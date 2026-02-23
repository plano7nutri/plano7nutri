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

  const functionName = "admin-get-users";
  console.log(`[${functionName}] Buscando dados administrativos.`);

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verificar se quem chama é o Robson (Admin)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error("Não autorizado");
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || user?.email !== "robson_cruz@live.com") {
      return new Response(JSON.stringify({ error: "Acesso negado. Apenas administradores podem ver estes dados." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      })
    }

    // Buscar dados das 3 tabelas
    const [pagos, gratis, leads] = await Promise.all([
      supabaseAdmin.from('clientes_pagos').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('usuarios_planogratis').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('usuarios_planogratis_registro_inicial').select('*').order('created_at', { ascending: false })
    ]);

    return new Response(JSON.stringify({ 
      pagos: pagos.data || [], 
      gratis: gratis.data || [], 
      leads: leads.data || [] 
    }), {
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