import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/components/Dashboard";
import { Loader2, Zap, Clock, ArrowRight, Crown } from "lucide-react";
import ComparisonCard from "@/components/ComparisonCard";
import DashboardWhatsAppMockup from "@/components/DashboardWhatsAppMockup";
import FAQSection from "@/components/FAQSection";
import Testimonials from "@/components/Testimonials";
import PricingSection from "@/components/PricingSection";

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
          <div className="max-w-3xl mx-auto">
            {/* Banner de Expiração com Destaque Premium */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 border-2 border-emerald-500 shadow-2xl mb-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 blur-[60px] rounded-full -ml-15 -mb-15" />
              
              <div className="relative z-10 p-8 md:p-12">
                {/* Ícone e Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-widest mb-6 border border-white/30">
                  <Clock size={12} />
                  Acesso Grátis Expirado
                </div>

                {/* Título Principal */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                  Seu Plano Grátis Expirou
                </h2>
                
                {/* Subtítulo */}
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Você já tem seus dados salvos. Para <strong className="text-white underline decoration-amber-300/50">continuar recebendo cardápios semanais</strong>, 
                  escolha seu plano premium abaixo e tenha acesso imediato ao seu próximo plano personalizado.
                </p>

                {/* Benefícios Rápidos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/15 rounded-xl p-4 border border-white/20">
                    <Crown className="w-6 h-6 text-amber-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-white">Plano Semanal</p>
                    <p className="text-xs text-white/80">R$ 9,90</p>
                  </div>
                  <div className="bg-white/15 rounded-xl p-4 border border-white/20">
                    <div className="w-6 h-6 bg-emerald-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-white">Plano Mensal</p>
                    <p className="text-xs text-white/80">R$ 19,90/mês</p>
                  </div>
                  <div className="bg-white/15 rounded-xl p-4 border border-white/20">
                    <Zap className="w-6 h-6 text-white mx-auto mb-2" />
                    <p className="text-sm font-bold text-white">Renove Semanal</p>
                    <p className="text-xs text-white/80">Semestre integrado</p>
                  </div>
                </div>

                {/* Botão Principal */}
                <button 
                  onClick={() => document.getElementById('planos-pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-3 bg-white text-emerald-800 px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-white/95 transition-all transform hover:scale-105"
                >
                  <Crown size={24} />
                  Escolher Meu Plano
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Seção de Preços */}
            <div id="planos-pricing">
              <PricingSection createdAt={dashData.created_at} />
            </div>
          </div>
          
          {/* Mockup do WhatsApp */}
          <div className="mt-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                É assim que chega no seu WhatsApp
              </h2>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden border-2 border-zinc-100 shadow-sm bg-white">
              <DashboardWhatsAppMockup />
            </div>
          </div>
          
          <div className="mt-16">
            <Testimonials />
          </div>
          
          <div className="mt-16">
            <FAQSection />
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