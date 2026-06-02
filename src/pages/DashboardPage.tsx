import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/Dashboard";
import { Loader2 } from "lucide-react";
import ComparisonCard from "@/components/ComparisonCard";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const storedWhatsapp = localStorage.getItem("plano7_free_whatsapp");
  const initialData = location.state;
  const whatsappToFetch = initialData?.whatsapp || storedWhatsapp;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Lógica para impedir que o botão voltar do celular saia do Dashboard
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const { data: dashData, isLoading } = useQuery({
    queryKey: ["userPlan", whatsappToFetch],
    queryFn: async () => {
      if (!whatsappToFetch) return null;
      const { data, error } = await supabase
        .from("usuarios_planogratis")
        .select("*")
        .eq("whatsapp", whatsappToFetch)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!whatsappToFetch,
  });

  useEffect(() => {
    if (!whatsappToFetch && !isLoading) {
      navigate("/", { state: { view: "check-free-plan" }, replace: true });
    }
  }, [whatsappToFetch, isLoading, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("plano7_free_whatsapp");
    // Navega para a home substituindo o histórico, sem tentar dar "back"
    navigate("/", { state: { view: "check-free-plan" }, replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Carregando seu plano personalizado...</p>
      </div>
    );
  }

  // Redireciona se não temos dados do WhatsApp ou se a consulta não retornou dados
  if (!whatsappToFetch || !dashData) {
    navigate("/", { state: { view: "check-free-plan" }, replace: true });
    return null;
  }

  // Verifica se o acesso gratuito expirou (mais de 48 horas desde a criação)
  const isExpired = dashData && dashData.created_at 
    ? (Date.now() - new Date(dashData.created_at).getTime()) > (48 * 60 * 60 * 1000)
    : false;

  // Se expirado, mostra mensagem de expiração e o card Economia Real & Inteligência
  if (isExpired) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Acesso Grátis Expirado
            </h2>
            <p className="text-zinc-600 mb-6">
              Seu acesso gratuito ao Plano 7 expirou após 48 horas. 
              Para continuar recebendo seus planos personalizados, 
              considere atualizar para um dos nossos planos premium.
            </p>
            <ComparisonCard createdAt={dashData.created_at} />
          </div>
        </main>
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
          weight={displayData.weight || displayData.peso}
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
          entregue={displayData.entregue}
          cardapio={displayData.cardapio}
          lista={displayData.lista}
          perfil_editado={displayData.perfil_editado}
          createdAt={displayData.created_at}
          onAvatarUpdate={() => queryClient.invalidateQueries({ queryKey: ["userPlan", displayData.whatsapp] })}
          onLogout={handleLogout}
        />
      </main>
    </div>
  );
};

export default DashboardPage;
</dyad-wrap>

Adicionei a verificação de expiração de 48 horas para perfis gratuitos na página do dashboard. Quando o acesso gratuito expira, agora mostra uma mensagem clara de expiração seguida da seção completa "Economia Real & Inteligência" (Componente ComparisonCard) na mesma página.

<dyad-chat-summary>Adicionando expiração de 48h para acesso gratuito e mostrando card de comparação</dyad-chat-summary><dyad-write path="src/pages/DashboardPage.tsx" description="Adicionando verificação de expiração de 48 horas para perfis gratuitos e mostrando a seção Economia Real & Inteligência quando expirado">
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/Dashboard";
import { Loader2 } from "lucide-react";
import ComparisonCard from "@/components/ComparisonCard";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const storedWhatsapp = localStorage.getItem("plano7_free_whatsapp");
  const initialData = location.state;
  const whatsappToFetch = initialData?.whatsapp || storedWhatsapp;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Lógica para impedir que o botão voltar do celular saia do Dashboard
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const { data: dashData, isLoading } = useQuery({
    queryKey: ["userPlan", whatsappToFetch],
    queryFn: async () => {
      if (!whatsappToFetch) return null;
      const { data, error } = await supabase
        .from("usuarios_planogratis")
        .select("*")
        .eq("whatsapp", whatsappToFetch)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!whatsappToFetch,
  });

  useEffect(() => {
    if (!whatsappToFetch && !isLoading) {
      navigate("/", { state: { view: "check-free-plan" }, replace: true });
    }
  }, [whatsappToFetch, isLoading, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("plano7_free_whatsapp");
    // Navega para a home substituindo o histórico, sem tentar dar "back"
    navigate("/", { state: { view: "check-free-plan" }, replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Carregando seu plano personalizado...</p>
      </div>
    );
  }

  // Redireciona se não temos dados do WhatsApp ou se a consulta não retornou dados
  if (!whatsappToFetch || !dashData) {
    navigate("/", { state: { view: "check-free-plan" }, replace: true });
    return null;
  }

  // Verifica se o acesso gratuito expirou (mais de 48 horas desde a criação)
  const isExpired = dashData && dashData.created_at 
    ? (Date.now() - new Date(dashData.created_at).getTime()) > (48 * 60 * 60 * 1000)
    : false;

  // Se expirado, mostra mensagem de expiração e o card Economia Real & Inteligência
  if (isExpired) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Acesso Grátis Expirado
            </h2>
            <p className="text-zinc-600 mb-6">
              Seu acesso gratuito ao Plano 7 expirou após 48 horas. 
              Para continuar recebendo seus planos personalizados, 
              considere atualizar para um dos nossos planos premium.
            </p>
            <ComparisonCard createdAt={dashData.created_at} />
          </div>
        </main>
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
          weight={displayData.weight || displayData.peso}
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
          entregue={displayData.entregue}
          cardapio={displayData.cardapio}
          lista={displayData.lista}
          perfil_editado={displayData.perfil_editado}
          createdAt={displayData.created_at}
          onAvatarUpdate={() => queryClient.invalidateQueries({ queryKey: ["userPlan", displayData.whatsapp] })}
          onLogout={handleLogout}
        />
      </main>
    </div>
  );
};

export default DashboardPage;