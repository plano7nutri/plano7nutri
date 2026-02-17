import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboardpago');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8 shadow-card"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar para o início
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Área do Assinante</h1>
          <p className="text-muted-foreground">Acesse seu plano personalizado completo.</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(160, 60%, 38%)',
                  brandAccent: 'hsl(160, 60%, 28%)',
                },
                radii: {
                  buttonRadius: '0.75rem',
                  inputRadius: '0.75rem',
                }
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Senha',
                email_input_placeholder: 'Seu endereço de e-mail',
                password_input_placeholder: 'Sua senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre aqui',
              },
              sign_up: {
                email_label: 'Endereço de e-mail',
                password_label: 'Senha',
                email_input_placeholder: 'Seu endereço de e-mail',
                password_input_placeholder: 'Sua senha',
                button_label: 'Criar conta',
                loading_button_label: 'Criando conta...',
                social_provider_text: 'Cadastrar com {{provider}}',
                link_text: 'Não tem uma conta? Cadastre-se',
                confirmation_text: 'Verifique seu e-mail para o link de confirmação',
              },
              forgotten_password: {
                email_label: 'Endereço de e-mail',
                password_label: 'Senha',
                email_input_placeholder: 'Seu endereço de e-mail',
                button_label: 'Enviar instruções de recuperação',
                loading_button_label: 'Enviando instruções...',
                link_text: 'Esqueceu sua senha?',
                confirmation_text: 'Verifique seu e-mail para o link de recuperação de senha',
              },
              update_password: {
                password_label: 'Nova senha',
                password_input_placeholder: 'Sua nova senha',
                button_label: 'Atualizar senha',
                loading_button_label: 'Atualizando senha...',
                confirmation_text: 'Sua senha foi atualizada',
              },
            },
          }}
          providers={[]}
          theme="light"
        />
      </motion.div>
    </div>
  );
};

export default Login;