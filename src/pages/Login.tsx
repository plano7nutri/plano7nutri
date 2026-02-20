import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';

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
        className="w-full max-w-md glass rounded-2xl p-8 shadow-card border border-primary/10"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Voltar para o início
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Área do Assinante</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse seu planejamento elite completo.</p>
        </div>

        <Auth
          supabaseClient={supabase}
          view="sign_in"
          showLinks={false} // Remove os links padrão de "esqueci senha" e "cadastrar" internos
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(160, 60%, 38%)',
                  brandAccent: 'hsl(160, 60%, 28%)',
                  inputBackground: 'white',
                  inputText: 'black',
                  inputPlaceholder: 'hsl(210, 10%, 50%)',
                },
                radii: {
                  buttonRadius: '0.75rem',
                  inputRadius: '0.75rem',
                }
              }
            },
            className: {
              container: 'auth-container',
              button: 'auth-button font-bold',
              input: 'auth-input',
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'E-mail',
                password_label: 'Senha',
                email_input_placeholder: 'Seu e-mail de cadastro',
                password_input_placeholder: 'Sua senha',
                button_label: 'Entrar agora',
                loading_button_label: 'Autenticando...',
              }
            },
          }}
          providers={[]}
          theme="light"
        />

        {/* Link personalizado solicitado */}
        <div className="mt-8 text-center pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Não tem conta?{' '}
            <button 
              onClick={() => navigate('/', { state: { view: 'onboarding' } })}
              className="text-primary font-bold hover:underline"
            >
              Teste grátis
            </button>
          </p>
          
          <button 
            onClick={() => {
              // Simula um "esqueci minha senha" se necessário ou redireciona
              toast.info("Para recuperar sua senha, utilize o link de confirmação enviado ao seu e-mail.");
            }}
            className="text-xs text-muted-foreground hover:text-foreground mt-4 block mx-auto transition-colors"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;