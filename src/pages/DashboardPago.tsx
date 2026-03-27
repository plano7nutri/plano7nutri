import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import PremiumDashboard from "@/components/PremiumDashboard";
import OnboardingWizard, { type OnboardingData } from "@/components/OnboardingWizard";
import { Loader2, ShieldAlert, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { formatTelefoneCadastro } from "@/lib/utils";

const ADMIN_EMAIL = "robson_cruz@live.com";

const activityFactors: Record<string, number> = {
  "Sedentário": 1.2,
  "Levemente ativo": 1.375,
  "Moderadamente ativo": 1.55,
  "Muito ativo": 1.725,
  "Extremamente ativo": 1.9,
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
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Segurança: Só aceita adminViewData se o usuário logado for o Robson
  const adminViewData = (user?.email === ADMIN_EMAIL) ? location.state?.adminViewData : null;

  const { data: userData, isLoading: dataLoading } = useQuery({
    queryKey: ["premiumUser", adminViewData?.id || user?.id],
    queryFn: async () => {
      if (adminViewData) return adminViewData;
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("clientes_pagos")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!adminViewData || !!user?.id,
  });

  useEffect(() => {
    if (!authLoading && !user && !adminViewData) {
      navigate("/login", { replace: true });
    }
  }, [user, authLoading, navigate, adminViewData]);

  const calculateNutrition = (data: any) => {
    const tmb = data.sex === "male" ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5 : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    const factor = activityFactors[data.activity] || 1.2;
    const get = Math.round(tmb * factor);
    let metaCalorias = get;
    if (data.goal.includes("Perder") || data.goal === "lose_weight") metaCalorias = Math.round(get * 0.8);
    else if (data.goal.includes("Ganhar") || data.goal === "gain_muscle") metaCalorias = Math.round(get * 1.15);
    const metaAgua = Math.round((data.weight * 35) / 100) * 100;
    let protRatio = 0.3, carbRatio = 0.45, fatRatio = 0.25;
    if (metaCalorias < get) { protRatio = 0.35; carbRatio = 0.35; fatRatio = 0.3; }
    else if (metaCalorias > get) { protRatio = 0.3; carbRatio = 0.5; fatRatio = 0.2; }
    const proteina = Math.round((metaCalorias * protRatio) / 4);
    const carbo = Math.round((metaCalorias * carbRatio) / 4);
    const gordura = Math.round((metaCalorias * fatRatio) / 9);
    return { tmb: Math.round(tmb), get, metaCalorias, metaAgua, proteina, carbo, gordura };
  };

  const handleUpdateProfile = async (data: any) => {
    if (adminViewData) {
      toast.error("Modo visualização: Você não pode editar dados de outros usuários.");
      return;
    }
    if (!user?.id || !userData) return;
    setIsProcessing(true);
    try {
      const nutrition = calculateNutrition(data);
      
      // Disparo do Webhook Plano Pago
      fetch('https://editor.saas.inventiia.com.br/webhook/plano7_pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: userData.nome,
          whatsapp: userData.whatsapp,
          email: userData.email,
          idade: data.age,
          peso: data.weight,
          altura: data.height,
          sexo_biologico: data.sex,
          nivel_atividade_fisica: data.activity,
          objetivo_semanal: data.goal,
          restricoes_alimentares: data.restrictions,
          preferencias: data.preferences,
          ...nutrition
        }),
        keepalive: true
      }).catch(err => console.warn("Erro silencioso no webhook pago:", err));

      const { error } = await supabase.from("clientes_pagos").update({
        idade: data.age,
        peso: data.weight,
        nivel_atividade_fisica: data.activity,
        objetivo_semanal: data.goal,
        restricoes_alimentares: data.restrictions,
        preferencias: data.preferences,
        meta_calorias: nutrition.metaCalorias,
        meta_agua: nutrition.metaAgua,
        tmb: nutrition.tmb,
        get: nutrition.get,
        proteina_dia: nutrition.proteina,
        carbo_dia: nutrition.carbo,
        gordura_dia: nutrition.gordura,
      }).eq("id", user.id);
      
      if (error) throw error;
      toast.success("Perfil atualizado!");
      queryClient.invalidateQueries({ queryKey: ["premiumUser", user.id] });
    } catch (err) {
      toast.error("Erro ao atualizar.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInitialOnboarding = async (data: OnboardingData) => {
    if (!user?.id || !userData) return;
    setIsProcessing(true);
    try {
      const nutrition = calculateNutrition({ ...data, activity: activityLabels[data.activity] || data.activity, goal: goalLabels[data.goal] || data.goal });
      
      // Formatação fiel para telefone_cadastro
      const telefoneCadastro = formatTelefoneCadastro(data.whatsapp);

      // Disparo do Webhook Plano Pago (Onboarding)
      fetch('https://editor.saas.inventiia.com.br/webhook/plano7_pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.name,
          whatsapp: userData.whatsapp,
          email: userData.email,
          idade: data.age,
          peso: data.weight,
          altura: data.height,
          sexo_biologico: data.sex,
          nivel_atividade_fisica: activityLabels[data.activity] || data.activity,
          objetivo_semanal: goalLabels[data.goal] || data.goal,
          restricoes_alimentares: data.restrictions || "Nenhuma",
          preferencias: data.preferences || "Nenhuma",
          ...nutrition
        }),
        keepalive: true
      }).catch(err => console.warn("Erro silencioso no webhook pago:", err));

      const { error } = await supabase.from("clientes_pagos").update({
        nome: data.name,
        nome_usuario: data.name,
        sexo_biologico: data.sex,
        idade: data.age,
        altura: data.height,
        peso: data.weight,
        nivel_atividade_fisica: activityLabels[data.activity] || data.activity,
        objetivo_semanal: goalLabels[data.goal] || data.goal,
        restricoes_alimentares: data.restrictions || "Nenhuma",
        preferencias: data.preferences || "Nenhuma",
        meta_calorias: nutrition.metaCalorias,
        meta_agua: nutrition.metaAgua,
        tmb: nutrition.tmb,
        get: nutrition.get,
        proteina_dia: nutrition.proteina,
        carbo_dia: nutrition.carbo,
        gordura_dia: nutrition.gordura,
        limite_cardapio_unico: 0,
        telefone_cadastro: telefoneCadastro
      }).eq("id", user.id);
      
      if (error) throw error;
      toast.success("Perfil configurado!");
      queryClient.invalidateQueries({ queryKey: ["premiumUser", user.id] });
    } catch (err) {
      toast.error("Erro ao salvar.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  if (authLoading || dataLoading || isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#051c14]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-emerald-400/60 font-medium">Sincronizando dados...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#051c14] px-6 text-center">
        <ShieldAlert className="text-amber-500 w-16 h-16 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Perfil em Sincronização</h2>
        <button onClick={() => queryClient.invalidateQueries({ queryKey: ["premiumUser"] })} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold mb-4">Tentar Novamente</button>
        <button onClick={handleLogout} className="text-zinc-500 font-bold">Sair</button>
      </div>
    );
  }

  const isFirstAccess = !userData.idade || !userData.peso;

  if (isFirstAccess && !adminViewData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 px-6 text-center"><h1 className="text-2xl font-bold">Bem-vindo ao Plano 7 Premium</h1></div>
        <OnboardingWizard 
          onComplete={handleInitialOnboarding} 
          onBack={() => signOut()} 
          hideLoginLink={true} 
          skipInternalValidation={true}
          initialEmail={userData.email}
        />
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
          tipo_assinatura={userData.tipo_assinatura}
          plano_semanal={userData.plano_semanal}
          ultimo_envio_plano={userData.ultimo_envio_plano}
          limite_cardapio_unico={userData.limite_cardapio_unico}
          assinatura_ativa={userData.assinatura_ativa}
          cardapio={userData.cardápio}
          lista={userData.Lista}
          entregue={userData.entregue}
          onAvatarUpdate={() => queryClient.invalidateQueries({ queryKey: ["premiumUser"] })}
          onLogout={handleLogout}
          onProfileUpdate={handleUpdateProfile}
          lastUpdateDate={userData.created_at} 
          isAdminView={!!adminViewData}
        />
      </main>
    </div>
  );
};

export default DashboardPago;