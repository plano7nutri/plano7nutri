import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/Dashboard";
import { Loader2 } from "lucide-react";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const initialData = location.state;

  const { data: dashData, isLoading } = useQuery({
    queryKey: ["userPlan", initialData?.whatsapp],
    queryFn: async () => {
      if (!initialData?.whatsapp) return null;
      const { data, error } = await supabase
        .from("usuarios_planogratis")
        .select("*")
        .eq("whatsapp", initialData.whatsapp)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!initialData?.whatsapp,
  });

  useEffect(() => {
    if (!initialData && !isLoading && !dashData) {
      navigate("/", { replace: true });
    }
  }, [initialData, dashData, isLoading, navigate]);

  if (isLoading && !initialData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Carregando seu plano personalizado...</p>
      </div>
    );
  }

  const displayData = dashData || initialData;

  if (!displayData) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Dashboard
          name={displayData.nome}
          whatsapp={displayData.whatsapp}
          age={displayData.idade}
          sex={displayData.sexo_biologico}
          height={displayData.altura}
          weight={displayData.peso}
          activityLabel={displayData.nivel_atividade_fisica}
          goalLabel={displayData.objetivo_semanal}
          tmb={displayData.tmb}
          get={displayData.get}
          metaCalorias={displayData.meta_calorias}
          metaAgua={displayData.meta_agua}
          proteina={displayData.proteina_dia}
          carbo={displayData.carbo_dia}
          gordura={displayData.gordura_dia}
          restrictions={displayData.restricoes_alimentares}
          preferences={displayData.preferencias}
          avatarUrl={displayData.avatar_url}
          onAvatarUpdate={() => queryClient.invalidateQueries({ queryKey: ["userPlan", displayData.whatsapp] })}
        />
      </main>
    </div>
  );
};

export default DashboardPage;