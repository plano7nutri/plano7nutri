import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "@/components/Dashboard";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dashData = location.state;

  useEffect(() => {
    if (!dashData) {
      navigate("/");
    }
  }, [dashData, navigate]);

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