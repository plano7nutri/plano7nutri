import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, UserPlus, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { formatWhatsApp } from "@/lib/utils";

const ADMIN_EMAIL = "robson_cruz@live.com";

const AdminRegister = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showMasterSecret, setShowMasterSecret] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    adminSecret: "",
    tipo_assinatura: "Unica",
    plano_semanal: false,
    assinatura_ativa: true,
  });

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.email !== ADMIN_EMAIL) {
      toast.error("Erro: Apenas o administrador Robson pode realizar cadastros.");
      return;
    }

    const cleanWhatsapp = formatWhatsApp(formData.whatsapp);
    if (cleanWhatsapp.length < 12) {
      toast.error("Informe um WhatsApp válido com DDD.");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('https://aoghhoqiwjwqfjifaait.supabase.co/functions/v1/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.email, // Padronização: Senha é o e-mail
          phone: cleanWhatsapp,
          admin_secret: formData.adminSecret,
          metadata: {
            nome: formData.nome,
            full_name: formData.nome,
            whatsapp: cleanWhatsapp,
            tipo_assinatura: formData.tipo_assinatura,
            plano_semanal: formData.plano_semanal,
            assinatura_ativa: formData.assinatura_ativa
          }
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro no cadastro.");

      toast.success("Usuário Elite cadastrado com sucesso!");
      setFormData({ ...formData, nome: "", email: "", whatsapp: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8 shadow-card border-2 border-primary/20"
      >
        <button onClick={() => navigate('/dashboardpago')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="text-primary" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground text-sm">Cadastro de Clientes Elite</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4">
            <label className="block text-xs font-bold text-amber-700 uppercase mb-2">Senha Mestre</label>
            <div className="relative">
              <input
                type={showMasterSecret ? "text" : "password"}
                required
                value={formData.adminSecret}
                onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border bg-white outline-none text-sm"
              />
              <button type="button" onClick={() => setShowMasterSecret(!showMasterSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showMasterSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <input type="text" placeholder="Nome do Cliente" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border bg-card outline-none" />
            <input type="tel" placeholder="WhatsApp (ex: 11999999999)" required value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border bg-card outline-none" />
            
            <select value={formData.tipo_assinatura} onChange={(e) => setFormData({ ...formData, tipo_assinatura: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border bg-card outline-none">
              <option value="Unica">Cardápio Único</option>
              <option value="Mensal">Plano Mensal</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border">
                <span className="text-[10px] font-bold uppercase">Trava 7 dias</span>
                <input type="checkbox" checked={formData.plano_semanal} onChange={(e) => setFormData({ ...formData, plano_semanal: e.target.checked })} className="w-5 h-5 accent-primary" />
              </div>
              <div className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${formData.assinatura_ativa ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <span className="text-[10px] font-bold uppercase">Ativa</span>
                <input type="checkbox" checked={formData.assinatura_ativa} onChange={(e) => setFormData({ ...formData, assinatura_ativa: e.target.checked })} className="w-5 h-5 accent-emerald-600" />
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <label className="block text-sm font-medium text-foreground mb-2">E-mail de Acesso</label>
              <input type="email" placeholder="cliente@email.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border bg-card outline-none" />
              <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-tighter">
                * A senha será automaticamente o e-mail informado.
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-glow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus size={20} /> Cadastrar Cliente</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminRegister;