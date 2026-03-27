import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, UserPlus, Settings, Users, Database, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { formatWhatsApp } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUserList from "@/components/AdminUserList";
import { useQuery } from "@tanstack/react-query";

const ADMIN_EMAIL = "robson_cruz@live.com";

const AdminRegister = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showMasterSecret, setShowMasterSecret] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    whatsapp: "",
    adminSecret: "",
    tipo_assinatura: "Unica",
    plano_semanal: false,
    assinatura_ativa: true,
  });

  // Query para buscar todos os usuários via Edge Function
  const { data: allUsers, isLoading: usersLoading, refetch } = useQuery({
    queryKey: ["adminAllUsers"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('https://aoghhoqiwjwqfjifaait.supabase.co/functions/v1/admin-get-users', {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (!response.ok) throw new Error("Erro ao buscar usuários");
      return response.json();
    },
    enabled: !!user && user.email === ADMIN_EMAIL
  });

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('https://aoghhoqiwjwqfjifaait.supabase.co/functions/v1/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          admin_secret: formData.adminSecret,
          metadata: {
            nome: formData.nome.trim(),
            whatsapp: formatWhatsApp(formData.whatsapp),
            tipo_assinatura: formData.tipo_assinatura,
            plano_semanal: formData.plano_semanal,
            assinatura_ativa: formData.assinatura_ativa
          }
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao processar cadastro.");

      toast.success("Cliente Elite cadastrado!");
      setFormData({ ...formData, nome: "", email: "", whatsapp: "", password: "" });
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button onClick={() => navigate('/dashboardpago')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
              <ArrowLeft size={16} /> Voltar ao meu Dashboard
            </button>
            <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-3">
              <Settings className="text-primary" size={32} />
              Painel de Controle Administrativo
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Admin Logado</p>
              <p className="text-sm font-bold text-zinc-900">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={20} />
            </div>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-8">
          <TabsList className="bg-white border border-zinc-200 p-1 rounded-xl h-auto flex-wrap justify-start">
            <TabsTrigger value="users" className="gap-2 py-2.5 px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users size={18} /> Clientes Pagos
            </TabsTrigger>
            <TabsTrigger value="gratis" className="gap-2 py-2.5 px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              <Database size={18} /> Clientes Grátis
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2 py-2.5 px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              <Zap size={18} /> Leads (Iniciais)
            </TabsTrigger>
            <TabsTrigger value="register" className="gap-2 py-2.5 px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              <UserPlus size={18} /> Cadastrar Novo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-0">
            {usersLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div> : <AdminUserList users={allUsers?.pagos} type="pago" />}
          </TabsContent>

          <TabsContent value="gratis" className="mt-0">
            {usersLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div> : <AdminUserList users={allUsers?.gratis} type="gratis" />}
          </TabsContent>

          <TabsContent value="leads" className="mt-0">
            {usersLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div> : <AdminUserList users={allUsers?.leads} type="lead" />}
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Novo Cadastro Elite</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4">
                  <label className="block text-[10px] font-bold text-amber-700 uppercase mb-2">Senha Mestre (Admin)</label>
                  <div className="relative">
                    <input type={showMasterSecret ? "text" : "password"} required value={formData.adminSecret} onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })} className="w-full px-4 py-2 rounded-lg border bg-white text-sm outline-none text-zinc-950" />
                    <button type="button" onClick={() => setShowMasterSecret(!showMasterSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showMasterSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <input type="text" placeholder="Nome Completo" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20 text-zinc-950 font-medium" />
                <input type="tel" placeholder="WhatsApp com DDD" required value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20 text-zinc-950 font-medium" />
                <input type="email" placeholder="E-mail do Cliente" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20 text-zinc-950 font-medium" />
                
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Defina a Senha do Cliente" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-zinc-50 outline-none focus:ring-2 focus:ring-primary/20 text-zinc-950 font-medium" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <select value={formData.tipo_assinatura} onChange={(e) => setFormData({ ...formData, tipo_assinatura: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-zinc-50 outline-none font-bold text-zinc-950">
                  <option value="Unica">Cardápio Único</option>
                  <option value="Mensal">Plano Mensal</option>
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border cursor-pointer">
                    <span className="text-[10px] font-bold uppercase text-zinc-950">Trava 7 dias</span>
                    <input type="checkbox" checked={formData.plano_semanal} onChange={(e) => setFormData({ ...formData, plano_semanal: e.target.checked })} className="w-5 h-5 accent-primary" />
                  </label>
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${formData.assinatura_ativa ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <span className="text-[10px] font-bold uppercase text-zinc-950">Ativa</span>
                    <input type="checkbox" checked={formData.assinatura_ativa} onChange={(e) => setFormData({ ...formData, assinatura_ativa: e.target.checked })} className="w-5 h-5 accent-emerald-600" />
                  </label>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-glow disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> Cadastrar Cliente</>}
                </button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminRegister;