import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import PremiumDashboard from "@/components/PremiumDashboard";
import OnboardingWizard, { type OnboardingData } from "@/components/OnboardingWizard";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

const DashboardPago = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);

  const { data: userData, isLoading: dataLoading } = useQuery({
    queryKey: ["premiumUser", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("clientes_pagos")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleCompleteOnboarding = async (data: OnboardingData) => {
    if (!user?.id) return;
    
    setIsCompletingOnboarding(true);
    try {
      // Cálculos (Mesma lógica do Index.tsx para consistência)
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

      const updateData = {
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

      const { error } = await supabase
        .from("clientes_pagos")
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil premium configurado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["premiumUser", user.id] });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar seus dados.");
    } finally {
      setIsCompletingOnboarding(false);
    }
  };

  if (authLoading || dataLoading || isCompletingOnboarding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#051c14]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-emerald-400/60 font-medium">Processando seus dados premium...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#051c14] px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Plano não encontrado</h2>
        <p className="text-zinc-400 mb-8">Não conseguimos localizar seus dados premium. Entre em contato com o suporte.</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  // Se não tiver idade ou peso, significa que é o primeiro acesso e precisa do wizard
  const isFirstAccess = !userData.idade || !userData.peso;

  if (isFirstAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 px-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao Plano 7 Premium</h1>
          <p className="text-muted-foreground">Vamos personalizar sua experiência de elite.</p>
        </div>
        <OnboardingWizard 
          onComplete={handleCompleteOnboarding}
          onBack={() => signOut()}
          onGoToLogin={() => {}} // Já está logado
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#051c14]">
      <main className="flex-1">
        <PremiumDashboard
          name={userData.nome}
          whatsapp={userData.whatsapp}
          age={userData.idade}
          sex={userData.sexo_biologico}
          height={userData.altura}
          weight={userData.peso}
          activityLabel={userData.nivel_atividade_fisica}
          goalLabel={userData.objetivo_semanal}
          tmb={userData.tmb}
          get={userData.get}
          metaCalorias={userData.meta_calorias}
          metaAgua={userData.meta_agua}
          proteina={userData.proteina_dia}
          carbo={userData.carbo_dia}
          gordura={userData.gordura_dia}
          restrictions={userData.restricoes_alimentares}
          preferences={userData.preferencias}
          avatarUrl={userData.avatar_url}
          onAvatarUpdate={() => queryClient.invalidateQueries({ queryKey: ["premiumUser", user?.id] })}
        />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPago;