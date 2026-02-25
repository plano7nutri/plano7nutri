import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import OnboardingWizard, { type OnboardingData } from "@/components/OnboardingWizard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatWhatsApp } from "@/lib/utils";
import Footer from "@/components/Footer";

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

const Cadastro = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const handleComplete = async (data: OnboardingData) => {
    try {
      // Aplica a formatação robusta na camada de banco
      const finalWhatsapp = formatWhatsApp(data.whatsapp);
      
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
        whatsapp: finalWhatsapp,
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
        entregue: false,
      };

      const { error: insertError } = await supabase
        .from("usuarios_planogratis")
        .insert([dashData]);

      if (insertError) throw new Error(insertError.message);

      toast.success("Plano calculado com sucesso!");
      localStorage.setItem("plano7_free_whatsapp", dashData.whatsapp);
      navigate("/dashboard", { state: dashData });
    } catch (err: any) {
      console.error("Erro no processo:", err);
      toast.error(err.message || "Erro ao processar dados.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <OnboardingWizard 
          onComplete={handleComplete} 
          onBack={() => navigate("/")} 
          onGoToLogin={() => navigate("/", { state: { view: "check-free-plan" } })}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Cadastro;