import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Landing from "@/components/Landing";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, AlertCircle, PlusCircle, MessageCircle, Crown } from "lucide-react";
import { formatWhatsApp } from "@/lib/utils";

type View = "landing" | "check-free-plan" | "check-paid-plan";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [loginWhatsapp, setLoginWhatsapp] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'not_found' | 'pending'>('idle');
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    try {
      setTheme("light");
    } catch (e) {
      console.warn("Falha ao definir tema:", e);
    }
  }, [setTheme]);

  useEffect(() => {
    if (location.state?.view) {
      setView(location.state.view as View);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleStart = () => {
    const message = encodeURIComponent("Quero calcular meu metabolismo, grátis. Vim do seu site!");
    window.open(`https://wa.me/5511933735838?text=${message}`, "_blank");
  };

  const handleLoginFree = async () => {
    const cleanWhatsapp = formatWhatsApp(loginWhatsapp);
    if (cleanWhatsapp.length < 10) {
      toast.error("Informe um WhatsApp válido com DDD.");
      return;
    }

    setIsLoggingIn(true);
    setLoginStatus('idle');
    try {
      const { data, error } = await supabase
        .from("usuarios_planogratis")
        .select("*")
        .eq("whatsapp", cleanWhatsapp)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setLoginStatus('not_found');
        return;
      }

      if (!data.nome || data.nome.trim() === "") {
        setLoginStatus('pending');
        return;
      }

      toast.success(`Bem-vindo de volta, ${data.nome}!`);
      localStorage.setItem("plano7_free_whatsapp", data.whatsapp);
      navigate("/dashboard", { state: data });
    } catch (err) {
      toast.error("Erro ao buscar seu plano.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLoginPaid = async () => {
    const cleanWhatsapp = formatWhatsApp(loginWhatsapp);
    if (cleanWhatsapp.length < 10) {
      toast.error("Informe um WhatsApp válido com DDD.");
      return;
    }

    setIsLoggingIn(true);
    setLoginStatus('idle');
    try {
      const { data, error } = await supabase
        .from("clientes_pagos")
        .select("*")
        .eq("whatsapp", cleanWhatsapp)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setLoginStatus('not_found');
        return;
      }

      // Lógica solicitada: Se objetivo_semanal estiver vazio, vai para o cadastro. Se preenchido, vai para o dash.
      if (!data.objetivo_semanal || data.objetivo_semanal.trim() === "") {
        toast.info("Quase lá! Complete seu perfil para acessar seu plano.");
        navigate("/cadastro", { state: { ...data, isPaid: true } });
      } else {
        toast.success(`Bem-vindo ao seu Dashboard Elite, ${data.nome}!`);
        localStorage.setItem("plano7_paid_whatsapp", data.whatsapp);
        navigate("/dashboardpago", { state: { userData: data } });
      }
    } catch (err) {
      toast.error("Erro ao validar seu acesso pago.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen-dynamic bg-background text-foreground overflow-x-hidden">
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div 
            key={view} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {view === "landing" ? (
              <Landing 
                onStart={handleStart} 
                onLogin={() => setView("check-paid-plan")} 
              />
            ) : (
              <div className="min-h-screen-dynamic flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-card border border-zinc-200">
                  <div className="flex items-center gap-2 mb-2">
                    {view === "check-paid-plan" && <Crown className="text-amber-500 w-5 h-5" />}
                    <h2 className="text-2xl font-bold text-zinc-900">
                      {view === "check-paid-plan" ? "Acessar Plano Pago" : "Acessar meu plano grátis"}
                    </h2>
                  </div>
                  <p className="text-zinc-500 mb-8 text-sm">Informe seu WhatsApp para acessar seu planejamento.</p>
                  
                  <form onSubmit={(e) => { 
                    e.preventDefault(); 
                    view === "check-paid-plan" ? handleLoginPaid() : handleLoginFree(); 
                  }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={loginWhatsapp}
                        onChange={(e) => {
                          setLoginWhatsapp(e.target.value);
                          setLoginStatus('idle');
                        }}
                        className={`w-full px-4 py-3 rounded-xl border bg-zinc-50 text-zinc-900 text-lg font-medium focus:outline-none focus:ring-2 ${
                          loginStatus !== 'idle' ? "border-destructive focus:ring-destructive" : "focus:ring-primary/20"
                        }`}
                      />
                    </div>

                    {loginStatus === 'not_found' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                      >
                        <div className="flex items-start gap-2 text-destructive mb-4">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-bold leading-tight">
                            {view === "check-paid-plan" 
                              ? "Usuário não existe em nossa base de clientes pagos." 
                              : "Número não encontrado."}
                          </p>
                        </div>
                        {view === "check-free-plan" && (
                          <button
                            type="button"
                            onClick={handleStart}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Calcular Meu Metabolismo Grátis
                          </button>
                        )}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoggingIn}
                      className={`w-full inline-flex items-center justify-center gap-2 text-white px-6 py-4 rounded-xl font-bold shadow-glow transition-all disabled:opacity-50 ${
                        view === "check-paid-plan" ? "bg-amber-600 hover:bg-amber-700" : "bg-primary"
                      }`}
                    >
                      {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Acessar Meu Plano"}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setView("landing")}
                      className="w-full text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Index;