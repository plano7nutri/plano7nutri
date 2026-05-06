import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success("Senha atualizada com sucesso!");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-card border border-zinc-200"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Nova Senha</h1>
          <p className="text-sm text-zinc-500 mt-1">Crie uma nova senha segura para o seu acesso.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="relative">
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Nova Senha</label>
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="Sua nova senha" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-[38px] text-zinc-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Confirmar Nova Senha</label>
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="Repita a nova senha" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-glow"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Salvar Nova Senha"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;