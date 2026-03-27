import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Landing from "@/components/Landing";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, AlertCircle, PlusCircle, MessageCircle } from "lucide-react";

type View = "landing" | "check-free-plan";

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
    const rawNumber = loginWhatsapp.replace(/\D/g, "");
    
    if (rawNumber.length < 10) {
      toast.error("Informe um WhatsApp válido com DDD.");
      return;
    }

    // Gerar variações exaustivas de busca
    const variations: string[] = [];
    
    // 1. Versão com 55
    const with55 = rawNumber.startsWith("55") ? rawNumber : "55" + rawNumber;
    variations.push(with55);
    
    // 2. Versão sem 55
    const without55 = rawNumber.startsWith("55") ? rawNumber.substring(2) : rawNumber;
    variations.push(without55);

    // 3. Lógica do 9º dígito para ambas as versões
    const finalVariations = [...variations];
    variations.forEach(v => {
      const isWith55 = v.startsWith("55");
      const ddd = isWith55 ? v.substring(2, 4) : v.substring(0, 2);
      const numPart = isWith55 ? v.substring(4) : v.substring(2);
      const prefix = isWith55 ? "55" : "";

      if (numPart.length === 9 && numPart[0] === '9') {
        finalVariations.push(prefix + ddd + numPart.substring(1));
      } else if (numPart.length === 8) {
        finalVariations.push(prefix + ddd + "9" + numPart);
      }
    });

    const uniqueVariations = Array.from(new Set(finalVariations));
    const variationsString = `(${uniqueVariations.join(',')})`;

    setIsLoggingIn(true);
    setLoginStatus('idle');
    
    try {
      // 1. BUSCA PRIORITÁRIA: Clientes Pagos
      const { data: paidUsers, error: paidError } = await supabase
        .from("clientes_pagos")
        .select("id, nome")
        .or(`whatsapp.in.${variationsString},telefone_cadastro.in.${variationsString}`);

      if (paidError) throw paidError;

      if (paidUsers && paidUsers.length > 0) {
        toast.info(`Identificamos seu acesso Elite (${paidUsers[0].nome}). Por favor, entre com seu e-mail e senha.`);
        navigate("/login");
        return;
      }

      // 2. BUSCA SECUNDÁRIA: Plano Grátis
      const { data: freeUser, error: freeError } = await supabase
        .from("usuarios_planogratis")
        .select("*")
        .in("whatsapp", uniqueVariations)
        .maybeSingle();

      if (freeError) throw freeError;

      if (!freeUser) {
        setLoginStatus('not_found');
        return;
      }

      if (!freeUser.nome || freeUser.nome.trim() === "") {
        setLoginStatus('pending');
        return;
      }

      toast.success(`Bem-vindo de volta, ${freeUser.nome}!`);
      localStorage.setItem("plano7_free_whatsapp", freeUser.whatsapp);
      navigate("/dashboard", { state: freeUser });
      
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