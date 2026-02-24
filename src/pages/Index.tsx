import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Landing from "@/components/Landing";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, AlertCircle, PlusCircle } from "lucide-react";
import { formatWhatsApp } from "@/lib/utils";

type View = "landing" | "check-free-plan";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [loginWhatsapp, setLoginWhatsapp] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    if (location.state?.view) {
      setView(location.state.view as View);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLoginFree = async () => {
    const cleanWhatsapp = formatWhatsApp(loginWhatsapp);
    if (cleanWhatsapp.length < 10) {
      toast.error("Informe um WhatsApp válido com DDD.");
      return;
    }

    setIsLoggingIn(true);
    setUserNotFound(false);
    try {
      const { data, error } = await supabase
        .from("usuarios_planogratis")
        .select("*")
        .eq("whatsapp", cleanWhatsapp)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        toast.success(`Bem-vindo de volta, ${data.nome}!`);
        localStorage.setItem("plano7_free_whatsapp", data.whatsapp);
        navigate("/dashboard", { state: data });
      } else {
        setUserNotFound(true);
      }
    } catch (err) {
      toast.error("Erro ao buscar seu plano.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {view === "landing" && (
              <Landing 
                onStart={() => navigate("/cadastro")} 
                onLogin={() => setView("check-free-plan")} 
              />
            )}
            
            {view === "check-free-plan" && (
              <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md glass rounded-2xl p-8 shadow-card bg-white border-zinc-200">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Acessar meu plano grátis</h2>
                  <p className="text-zinc-500 mb-8">Informe seu WhatsApp para ver seu planejamento.</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleLoginFree(); }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={loginWhatsapp}
                        onChange={(e) => {
                          setLoginWhatsapp(e.target.value);
                          setUserNotFound(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl border bg-zinc-50 text-zinc-900 text-lg font-medium focus:outline-none focus:ring-2 ${
                          userNotFound ? "border-destructive focus:ring-destructive" : "focus:ring-primary/20"
                        }`}
                      />
                    </div>

                    {userNotFound && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                      >
                        <div className="flex items-start gap-2 text-destructive mb-4">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-bold leading-tight">
                            Número não encontrado em nosso sistema.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate("/cadastro")}
                          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Criar meu plano grátis agora
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