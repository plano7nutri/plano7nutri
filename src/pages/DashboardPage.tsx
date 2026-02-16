import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/Dashboard";
import { Loader2 } from "lucide-react";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state;

  // Busca os dados mais recentes do banco de dados usando o WhatsApp como chave
  const { data: dashData, isLoading } = useQuery({
    queryKey: ["userPlan", initialData?.whatsapp],
    queryFn: async () => {
      if (!initialData?.whatsapp) return null;
      const { data, error } = await supabase
        .from("usuarios_planogratis")
        .select("*")
        .eq("whatsapp", initialData.whatsapp)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!initialData?.whatsapp,
    refetchInterval: 5000, // Atualiza a cada 5 segundos para pegar mudanças do n8n
  });

  useEffect(() => {
    if (!initialData) {
      navigate("/");
    }
  }, [initialData, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Carregando seu plano personalizado...</p>
      </div>
    );
  }

  if (!dashData) return null;

  return (
    <Dashboard
      name={dashData.nome}
      whatsapp={dashData.whatsapp}
      age={dashData.idade}
      sex={dashData.sexo_biologico}
      height={dashData.altura}
      weight={dashData.peso}
      activityLabel={dashData.nivel_atividade_fisica}
      goalLabel={dashData.objetivo_semanal}
      tmb={dashData.tmb}
      get={dashData.get}
      metaCalorias={dashData.meta_calorias}
      metaAgua={dashData.meta_agua}
      proteina={dashData.proteina_dia}
      carbo={dashData.carbo_dia}
      gordura={dashData.gordura_dia}
      restrictions={dashData.restricoes_alimentares}
      preferences={dashData.preferencias}
    />
  );
};

export default DashboardPage;