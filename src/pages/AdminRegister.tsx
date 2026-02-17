import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, UserPlus, ShieldAlert, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterSecret, setShowMasterSecret] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    password: "",
    adminSecret: "",
    tipo_assinatura: "Unica",
    plano_semanal: false,
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error("A senha do novo usuário deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      let cleanDigits = formData.whatsapp.replace(/\D/g, "");
      
      if (cleanDigits.length >= 10 && !cleanDigits.startsWith("55")) {
        cleanDigits = "55" + cleanDigits;
      }

      const authPhone = "+" + cleanDigits;
      const dbPhone = cleanDigits;

      const response = await fetch('https://aoghhoqiwjwqfjifaait.supabase.co/functions/v1/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          phone: authPhone,
          admin_secret: formData.adminSecret,
          metadata: {
            nome: formData.nome,
            full_name: formData.nome,
            whatsapp: dbPhone,
            tipo_assinatura: formData.tipo_assinatura,
            plano_semanal: formData.plano_semanal
          }
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Falha na autorização administrativa.");
      }

      // Atualizar campo boolean específico que a function pode não ter mapeado automaticamente
      await supabase
        .from('clientes_pagos')
        .update({ plano_semanal: formData.plano_semanal })
        .eq('id', result.user.id);

      toast.success("Usuário Elite cadastrado com sucesso!");
      setFormData({ nome: "", email: "", whatsapp: "", password: "", adminSecret: "", tipo_assinatura: "Unica", plano_semanal: false });
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error(error.message || "Erro de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8 shadow-card"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-primary" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Cadastro Administrativo</h1>
          <p className="text-muted-foreground">Crie novos usuários Elite confirmados.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4">
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <ShieldAlert size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Segurança Administrativa</span>
            </div>
            <div className="relative">
              <input
                type={showMasterSecret ? "text" : "password"}
                required
                placeholder="Senha Mestre do Sistema"
                value={formData.adminSecret}
                onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border bg-white text-foreground focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowMasterSecret(!showMasterSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showMasterSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Nome</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Assinatura</label>
                <select
                  value={formData.tipo_assinatura}
                  onChange={(e) => setFormData({ ...formData, tipo_assinatura: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-primary text-sm h-[46px]"
                >
                  <option value="Unica">Cardápio Único</option>
                  <option value="Mensal">Plano Mensal</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs font-bold text-foreground">Plano Semanal</p>
                  <p className="text-[10px] text-muted-foreground">Trava o botão por 7 dias</p>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={formData.plano_semanal}
                onChange={(e) => setFormData({ ...formData, plano_semanal: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">E-mail</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Senha do Usuário</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-card text-foreground outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-glow hover:shadow-card-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Autorizar e Cadastrar"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminRegister;