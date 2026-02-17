import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "@/components/Landing";
import OnboardingWizard, { type OnboardingData } from "@/components/OnboardingWizard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, AlertCircle, PlusCircle } from "lucide-react";

type View = "landing" | "onboarding" | "check-free-plan";

const activityFactors: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

const activityLabels: Record<string, string> = {
  sedentary: "Sedentário",
  lightly_active: "Levemente ativo",
  moderately_active: "Moderadamente ativo",
  very_active: "Muito ativo",
  extremely_active: "Extremamente ativo",
};

const goalLabels: Record<string, string> = {
  lose_weight: "Perder Peso / Emagrecer",
  gain_muscle: "Ganhar Massa Muscular (Hipertrofia)",
  healthy_eating: "Alimentação Saudável",
};

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [loginWhatsapp, setLoginWhatsapp] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const navigate = useNavigate();

  const handleLoginFree = async () => {
    if (loginWhatsapp.length < 10) {
      toast.error("Informe um WhatsApp válido.");
      return;
    }

    setIsLoggingIn(true);
    setUserNotFound(false);
    try {
      const { data, error } = await supabase
        .from("usuarios_planogratis")
        .select("*")
        .eq("whatsapp", loginWhatsapp)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        toast.success(`Bem-vindo de volta, ${data.nome}!`);
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

  const handleComplete = async (data: OnboardingData) => {
    try {
      const tmb =
        data.sex === "male"
          ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
          : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;

      const factor = activityFactors[data.activity] || 1.2;
      const get = Math.round(tmb * factor);

      let metaCalorias = get;
      if (data.goal === "lose_weight") metaCalorias = Math.round(get * 0.8);
      else if (data.goal === "gain_muscle") metaCalorias = Math.round(get * 1.15);

      const metaAgua = Math.round((data.weight * 35) / 100) * 100;

      let protRatio = 0.3, carbRatio = 0.45, fatRatio = 0.25;
      if (data.goal === "lose_weight") { protRatio = 0.35; carbRatio = 0.35; fatRatio = 0.3; }
      else if (data.goal === "gain_muscle") { protRatio = 0.3; carbRatio = 0.5; fatRatio = 0.2; }

      const proteina = Math.round((metaCalorias * protRatio) / 4);
      const carbo = Math.round((metaCalorias * carbRatio) / 4);
      const gordura = Math.round((metaCalorias * fatRatio) / 9);

      const dashData = {
        session_id: Math.random().toString(36).substring(7),
        nome: data.name,
        whatsapp: data.whatsapp,
        sexo_biologico: data.sex,
        idade: data.age,
        altura: data.height,
        peso: data.weight,
        nivel_atividade_fisica: activityLabels[data.activity] || data.activity,
        objetivo_semanal: goalLabels[data.goal] || data.goal,
        restricoes_alimentares: data.restrictions || "Nenhuma",
        preferencias: data.preferences || "Nenhuma",
        meta_calorias: metaCalorias,
        meta_agua: metaAgua,
        tmb: Math.round(tmb),
        get: get,
        proteina_dia: proteina,
        carbo_dia: carbo,
        gordura_dia: gordura,
        avatar_url: null,
      };

      const { error: insertError } = await supabase
        .from("usuarios_planogratis")
        .insert([dashData]);

      if (insertError) throw new Error(insertError.message);

      toast.success("Plano calculado com sucesso!");
      navigate("/dashboard", { state: dashData });
    } catch (err) {
      console.error("Erro no processo:", err);
      toast.error("Erro ao processar dados.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {view === "landing" && (
              <Landing onStart={() => setView("onboarding")} onLogin={() => setView("check-free-plan")} />
            )}
            
            {view === "onboarding" && (
              <OnboardingWizard 
                onComplete={handleComplete} 
                onBack={() => setView("landing")} 
                onGoToLogin={() => setView("check-free-plan")}
              />
            )}

            {view === "check-free-plan" && (
              <div className="min-h-screen flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-md glass rounded-2xl p-8 shadow-card">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Acessar meu plano grátis</h2>
                  <p className="text-muted-foreground mb-8">Informe seu WhatsApp para ver seu planejamento.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={loginWhatsapp}
                        onChange={(e) => {
                          setLoginWhatsapp(e.target.value);
                          setUserNotFound(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium focus:outline-none focus:ring-2 ${
                          userNotFound ? "border-destructive focus:ring-destructive" : "focus:ring-ring"
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
                            Não encontramos nenhum plano gratuito com este número.
                          </p>
                        </div>
                        <button
                          onClick={() => setView("onboarding")}
                          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Criar meu plano grátis agora
                        </button>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLoginFree}
                      disabled={isLoggingIn}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-bold shadow-glow transition-all disabled:opacity-50"
                    >
                      {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ver Meu Plano Grátis"}
                    </motion.button>

                    <button
                      onClick={() => setView("landing")}
                      className="w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                  </div>
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