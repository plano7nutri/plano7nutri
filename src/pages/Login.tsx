import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "next-themes";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [view, setView] = useState<'login' | 'forgot_password' | 'update_password'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forçar Modo Claro no Login
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  // Captura o evento de recuperação e trava o usuário na tela de redefinição
  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      sessionStorage.setItem('plano7_recovery', 'true');
      setView('update_password');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        sessionStorage.setItem('plano7_recovery', 'true');
        setView('update_password');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redireciona para o Dashboard apenas se NÃO estiver no modo de recuperação
  useEffect(() => {
    const isRecovering = sessionStorage.getItem('plano7_recovery') === 'true';
    if (isRecovering) {
      setView('update_password');
    } else if (session && view !== 'update_password') {
      navigate('/dashboardpago');
    }
  }, [session, navigate, view]);

  const isRecovering = typeof window !== 'undefined' && sessionStorage.getItem('plano7_recovery') === 'true';

  if (authLoading || (session && view !== 'update_password' && !isRecovering)) {
    return <div className="min-h-screen bg-background" />;
  }

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
      toast.success("Link de recuperação enviado para seu e-mail!");
      setView('login');
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      sessionStorage.removeItem('plano7_recovery');
      toast.success("Senha atualizada com sucesso!");
      navigate('/dashboardpago');
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRecovery = async () => {
    sessionStorage.removeItem('plano7_recovery');
    await supabase.auth.signOut();
    setView('login');
  };

  const handleFreeTest = () => {
    const message = encodeURIComponent("Quero calcular meu metabolismo, grátis. Vim do seu site!");
    window.open(`https://wa.me/5511933735838?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-card border border-zinc-200"
      >
        {view !== 'update_password' && (
          <button 
            onClick={() => view === 'login' ? navigate('/') : setView('login')}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-primary mb-8 transition-colors font-medium"
          >
            <ArrowLeft size={16} /> {view === 'login' ? 'Voltar para o início' : 'Voltar para o login'}
          </button>
        )}

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {view === 'login' && 'Área do Assinante'}
            {view === 'forgot_password' && 'Recuperar Senha'}
            {view === 'update_password' && 'Nova Senha'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {view === 'login' && 'Acesse seu planejamento elite completo.'}
            {view === 'forgot_password' && 'Enviaremos um link de acesso para o seu e-mail.'}
            {view === 'update_password' && 'Crie uma nova senha segura para o seu acesso.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.form key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">E-mail</label>
                <input type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Senha</label>
                <input type={showPassword ? "text" : "password"} required placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-zinc-400 hover:text-zinc-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-glow">{loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Entrar agora"}</button>
            </motion.form>
          )}

          {view === 'forgot_password' && (
            <motion.form key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">E-mail de Cadastro</label>
                <input type="email" required placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-glow">{loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Mail size={20} /> Enviar Link</>}</button>
            </motion.form>
          )}

          {view === 'update_password' && (
            <motion.form key="update" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Nova Senha</label>
                <input type={showPassword ? "text" : "password"} required placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-zinc-400 hover:text-zinc-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Confirmar Nova Senha</label>
                <input type={showPassword ? "text" : "password"} required placeholder="Repita a nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20 pr-12" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-glow">{loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Lock size={20} /> Salvar Nova Senha</>}</button>
            </motion.form>
          )}
        </AnimatePresence>

        {view !== 'update_password' && (
          <div className="mt-8 text-center pt-6 border-t border-zinc-100">
            {view === 'login' ? (
              <>
                <p className="text-sm text-zinc-500">Não tem conta? <button onClick={handleFreeTest} className="text-primary font-bold hover:underline">Teste grátis</button></p>
                <button onClick={() => setView('forgot_password')} className="text-xs text-zinc-400 hover:text-zinc-600 mt-4 block mx-auto transition-colors">Esqueceu sua senha?</button>
              </>
            ) : (
              <button onClick={() => setView('login')} className="text-sm text-primary font-bold hover:underline">Voltar para o Login</button>
            )}
          </div>
        )}

        {view === 'update_password' && (
          <div className="mt-8 text-center pt-6 border-t border-zinc-100">
            <button 
              onClick={handleCancelRecovery} 
              className="text-sm font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Cancelar e Voltar ao Início
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;