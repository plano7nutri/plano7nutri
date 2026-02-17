import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import PremiumDashboard from "@/components/PremiumDashboard";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

const DashboardPago = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#051c14]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-emerald-400/60 font-medium">Acessando área premium...</p>
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