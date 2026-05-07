import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { ArrowRight, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import Landing from "@/components/Landing";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import ComparisonCard from "@/components/ComparisonCard";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";

const Metabolismo = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/dashboardpago");
    }
  }, [session, navigate]);

  useEffect(() => {
    try {
      setTheme("light");
    } catch (e) {}
  }, [setTheme]);

  if (authLoading || session) {
    return <div className="min-h-screen bg-background" />;
  }

  const handleStart = () => {
    const element = document.getElementById("economia-real");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen-dynamic bg-background text-foreground overflow-x-hidden">
      <main className="flex-1 w-full">
        <Landing 
          onStart={handleStart} 
          onLogin={() => navigate("/login")} 
          hideFree={true}
          reverseSections={true}
          startBtnText="Quero Meu Plano Nutricional"
          loginBtnText="Acessar Meu Plano"
          hideTestimonials={true}
        />
        
        {/* Novos botões de ação */}
        <div className="container mx-auto px-6 -mt-12 mb-12">
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 w-full max-w-2xl mx-auto">
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-6 py-4 rounded-xl text-sm font-bold shadow-glow hover:shadow-card-hover transition-all duration-300 whitespace-nowrap"
            >
              Quero Meu Plano Nutricional
              <ArrowRight className="w-4 h-4 shrink-0" />
            </motion.button>
            
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 inline-flex items-center justify-center gap-3 bg-white text-primary border-2 border-primary px-6 py-4 rounded-xl text-sm font-bold hover:bg-primary/5 transition-all duration-300 whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              Acessar Meu Plano
            </motion.button>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <ComparisonCard />
          <PricingSection />
        </div>
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Metabolismo;