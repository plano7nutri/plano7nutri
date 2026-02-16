import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "@/components/Landing";
import OnboardingWizard, { type OnboardingData } from "@/components/OnboardingWizard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type View = "landing" | "onboarding";

// Fatores de atividade baseados na tabela Harris-Benedict
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
  const navigate = useNavigate();

  const handleComplete = async (data: OnboardingData) => {
    try {
      // 1. Verificação de duplicidade por WhatsApp
      const { data: existingUser, error: checkError } = await supabase
        .from("usuarios_planogratis")
        .select("id")
        .eq("whatsapp", data.whatsapp)
        .maybeSingle();

      if (checkError) console.error("Erro ao verificar duplicidade:", checkError);

      if (existingUser) {
        toast.error("Este número de WhatsApp já possui um plano cadastrado.");
        return;
      }

      // 2. CÁLCULOS NUTRICIONAIS (Fórmula Mifflin-St Jeor)
      // A altura (data.height) já vem em CM do OnboardingWizard
      const tmb =
        data.sex === "male"
          ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
          : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;

      const factor = activityFactors[data.activity] || 1.2;
      const get = Math.round(tmb * factor);

      // Ajuste de calorias conforme objetivo
      let metaCalorias = get;
      if (data.goal === "lose_weight") metaCalorias = Math.round(get * 0.8); // Déficit de 20%
      else if (data.goal === "gain_muscle") metaCalorias = Math.round(get * 1.15); // Superávit de 15%

      // Cálculo de Água (35ml por kg, arredondado para centenas)
      const metaAgua = Math.round((data.weight * 35) / 100) * 100;

      // Divisão de Macronutrientes (Proporções baseadas no objetivo)
      let protRatio = 0.3, carbRatio = 0.45, fatRatio = 0.25;
      
      if (data.goal === "lose_weight") { 
        protRatio = 0.35; // Mais proteína para saciedade
        carbRatio = 0.35; 
        fatRatio = 0.3; 
      } else if (data.goal === "gain_muscle") { 
        protRatio = 0.3; 
        carbRatio = 0.5; // Mais carbo para energia no treino
        fatRatio = 0.2; 
      }

      // Conversão de calorias para gramas (Prot/Carb = 4kcal/g, Gord = 9kcal/g)
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
      };

      // 3. Salvar no Supabase
      const { error: insertError } = await supabase
        .from("usuarios_planogratis")
        .insert([dashData]);

      if (insertError) throw new Error(insertError.message);

      toast.success("Plano calculado com sucesso!");
      navigate("/dashboard", { state: dashData });
    } catch (err) {
      console.error("Erro no processo:", err);
      toast.error("Erro ao processar dados. Tente novamente.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={view} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        transition={{ duration: 0.3 }}
      >
        {view === "landing" && <Landing onStart={() => setView("onboarding")} />}
        {view === "onboarding" && <OnboardingWizard onComplete={handleComplete} onBack={() => setView("landing")} />}
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;