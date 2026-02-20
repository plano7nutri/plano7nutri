import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<'login' | 'forgot_password'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (session) {
      navigate('/dashboardpago');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;
      toast.success("Link de recuperação enviado para seu e-index!");
      setView('login');
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8 shadow-card border border-primary/10"
      >
        <button 
          onClick={() => view === 'login' ? navigate('/') : setView('login')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> {view === 'login' ? 'Voltar para o início' : 'Voltar para o login'}
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {view === 'login' ? 'Área do Assinante' : 'Recuperar Senha'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {view === 'login' 
              ? 'Acesse seu planejamento elite completo.' 
              : 'Enviaremos um link de acesso para o seu e-mail.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {view === 'login' ? (
            <motion.form 
              key="login-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleLogin} 
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-foreground mb-1.5">Senha</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-muted-foreground hover:text-primary transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-glow hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Entrar agora"}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="reset-form"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleResetPassword} 
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">E-mail de Cadastro</label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-glow hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Mail size={20} /> Enviar Link de Acesso</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center pt-6 border-t border-border">
          {view === 'login' ? (
            <>
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
                onClick={() => setView('forgot_password')}
                className="text-xs text-muted-foreground hover:text-foreground mt-4 block mx-auto transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="text-sm text-primary font-bold hover:underline"
            >
              Voltar para o Login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;