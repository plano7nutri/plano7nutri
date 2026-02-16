import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "@/components/Landing";
import OnboardingWizard, { type OnboardingData } from "@/components/OnboardingWizard";
import Dashboard from "@/components/Dashboard";

type View = "landing" | "onboarding" | "dashboard";

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

interface DashData {
  name: string; whatsapp: string; age: number; sex: string; height: number; weight: number;
  activityLabel: string; goalLabel: string;
  tmb: number; get: number; metaCalorias: number; metaAgua: number;
  proteina: number; carbo: number; gordura: number;
  restrictions: string;
  preferences: string;
}

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [dash, setDash] = useState<DashData | null>(null);

  const handleComplete = (data: OnboardingData) => {
    // Mifflin-St Jeor
    const tmb =
      data.sex === "male"
        ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
        : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;

    const factor = activityFactors[data.activity] || 1.2;
    const get = Math.round(tmb * factor);

    // Goal-based calorie target
    let metaCalorias = get;
    if (data.goal === "lose_weight") metaCalorias = Math.round(get * 0.8);
    else if (data.goal === "gain_muscle") metaCalorias = Math.round(get * 1.15);

    // Water: ~35ml per kg
    const metaAgua = Math.round(data.weight * 35 / 100) * 100;

    // Macros based on goal
    let protRatio = 0.3, carbRatio = 0.45, fatRatio = 0.25;
    if (data.goal === "lose_weight") { protRatio = 0.35; carbRatio = 0.4; fatRatio = 0.25; }
    if (data.goal === "gain_muscle") { protRatio = 0.35; carbRatio = 0.45; fatRatio = 0.2; }

    const proteina = Math.round((metaCalorias * protRatio) / 4);
    const carbo = Math.round((metaCalorias * carbRatio) / 4);
    const gordura = Math.round((metaCalorias * fatRatio) / 9);

    setDash({
      name: data.name, whatsapp: data.whatsapp, age: data.age, sex: data.sex,
      height: data.height, weight: data.weight,
      activityLabel: activityLabels[data.activity] || data.activity,
      goalLabel: goalLabels[data.goal] || data.goal,
      tmb: Math.round(tmb), get, metaCalorias, metaAgua, proteina, carbo, gordura,
      restrictions: data.restrictions,
      preferences: data.preferences,
    });
    setView("dashboard");
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        {view === "landing" && <Landing onStart={() => setView("onboarding")} />}
        {view === "onboarding" && <OnboardingWizard onComplete={handleComplete} onBack={() => setView("landing")} />}
        {view === "dashboard" && dash && <Dashboard {...dash} />}
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;