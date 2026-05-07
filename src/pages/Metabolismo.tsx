import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Landing from "@/components/Landing";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { ArrowLeft, Loader2, AlertCircle, PlusCircle, MessageCircle, UserCheck } from "lucide-center";

type View = "landing" | "check-free-plan";

const Metabolismo = () => {
  const [view, setView] = useState<View>("landing");
  const [loginWhatsapp, setLoginWhatsapp] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'not_found' | 'pending'>('idle');
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/dashboardpago");
    }
  }, [session, navigate]);

  useEffect(() => {
    try {
      setTheme("light");
    } catch (e) {}
  }, [setTheme]);

  useEffect(() => {
    if (location.state?.view) {
      setView(location.state.view as View);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (authLoading || session) {
    return <div className="min-h-screen bg-background" />;
  }

  const handleStart = () => {
    const message = encodeURIComponent("Quero calcular meu metabolismo, grátis. Vim do seu site!");
    window.open(`https://wa.me/5511933735838?text=${message}`, "_blank");
  };

  const handleLoginFree = async () => {
    const rawNumber = loginWhatsapp.replace(/\D/g, "");
    
    if (rawNumber.length < 10) {
      toast.error("Informe um WhatsApp válido com DDD.");
      return;
    }

    const formattedNumber = rawNumber.startsWith("55") ? rawNumber : "55" + rawNumber;

    setIsLoggingIn(true);
    setLoginStatus('idle');
    
    try {
      const { data: paidCheck } = await supabase
        .from("clientes_pagos")
        .select("whatsapp")
        .eq("whatsapp", formattedNumber)
        .limit(1);

      if (paidCheck && paidCheck.length > 0) {
        toast.info("Identificamos seu acesso Premium. Por favor, entre com seu e-mail e senha.");
        navigate("/login");
        return;
      }

      const { data: freeUser } = await supabase
        .from("usuarios_planogratis")
        .select("*")
        .eq("whatsapp", formattedNumber)
        .maybeSingle();

      if (freeUser && freeUser.nome && freeUser.nome.trim() !== "") {
        toast.success(`Bem-vindo de volta, ${freeUser.nome}!`);
        localStorage.setItem("plano7_free_whatsapp", formattedNumber);
        navigate("/dashboard", { state: freeUser });
        return;
      }

      const { data: leadCheck } = await supabase
        .from("clientes_semcadastro")
        .select("whatsapp")
        .eq("whatsapp", formattedNumber)
        .maybeSingle();

      if (leadCheck || freeUser) {
        setLoginStatus('pending');
      } else {
        setLoginStatus('not_found');
      }
      
    } catch (err) {
      console.error("Erro no login:", err);
      toast.error("Erro ao validar seu acesso.");
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
                onLogin={() => setView("check-free-plan")} 
                hideFree={true}
              />
            ) : (
              <div className="min-h-screen-dynamic flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-card border border-zinc-200">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Acessar meu plano grátis</h2>
                  <p className="text-zinc-500 mb-8 text-sm">Informe seu WhatsApp para ver seu planejamento.</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleLoginFree(); }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: 11999999999 ou 1188888888"
                        value={loginWhatsapp}
                        onChange={(e) => {
                          setLoginWhatsapp(e.target.value);
                          setLoginStatus('idle');
                        }}
                        className={`w-full px-4 py-3 rounded-xl border bg-zinc-50 text-zinc-900 text-lg font-medium focus:outline-none focus:ring-2 ${
                          loginStatus !== 'idle' ? "border-destructive focus:ring-destructive" : "focus:ring-ring"
                        }`}
                      />
                      <p className="mt-2 text-[11px] font-semibold text-zinc-500 leading-tight">
                        O número deve conter o DDD. Se o seu número tiver o 9 na frente, coloque-o. Se não tiver, não coloque.
                      </p>
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
                            Número não encontrado.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleStart}
                          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Calcular Meu Metabolismo Grátis
                        </button>
                      </motion.div>
                    )}

                    {loginStatus === 'pending' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="p-4 rounded-xl bg-amber-50 border border-amber-200"
                      >
                        <div className="flex items-start gap-2 text-amber-700 mb-4">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-bold leading-tight">
                            Termine seu cadastro para acessar o plano.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate("/cadastro")}
                          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Terminar Cadastro
                        </button>
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoggingIn}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-xl font-bold shadow-glow transition-all disabled:opacity-50"
                    >
                      {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ver Meu Plano Grátis"}
                    </motion.button>

                    <div className="pt-4 border-t border-zinc-100 text-center space-y-4">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                        Se você é cliente pago clique no botão abaixo
                      </p>
                      <motion.button
                        type="button"
                        onClick={() => navigate("/login")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all uppercase tracking-wider text-xs"
                      >
                        <UserCheck className="w-4 h-4" />
                        Login Plano Pago
                      </motion.button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setView("landing")}
                      className="w-full text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center justify-center gap-2 pt-2"
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

export default Metabolismo;