import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Landing from "@/components/Landing";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";

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
    const message = encodeURIComponent("Quero calcular meu metabolismo, grátis. Vim do seu site!");
    window.open(`https://wa.me/5511933735838?text=${message}`, "_blank");
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
        />
      </main>
      <Footer />
    </div>
  );
};

export default Metabolismo;