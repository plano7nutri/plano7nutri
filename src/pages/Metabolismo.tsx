import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
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