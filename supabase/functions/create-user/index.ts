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

    // Validação da Senha Administrativa (Escondida no Servidor)
    const MASTER_PASSWORD = Deno.env.get('ADMIN_MASTER_PASSWORD');
    
    if (!admin_secret || admin_secret !== MASTER_PASSWORD) {
      console.error("[create-user] Tentativa de acesso não autorizado com segredo inválido.");
      return new Response(JSON.stringify({ error: "Acesso Negado: Senha Administrativa Inválida." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    console.log("[create-user] Autorizado. Tentando criar usuário:", email);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone,
      user_metadata: metadata,
      email_confirm: true,
      phone_confirm: true
    })

    if (error) throw error

    return new Response(JSON.stringify(data), {
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