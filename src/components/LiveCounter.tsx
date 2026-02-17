"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Crown, Utensils, Calendar } from "lucide-react";

const STORAGE_KEY = "plano7_live_stats_v2";

const LiveCounter = () => {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    return {
      premiumOnline: 508,
      freeOnline: 1492,
      menusToday: 2431,
      menusMonth: 27412
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        // Define um incremento comum para os totais para manter o "nexo"
        const newPlans = Math.floor(Math.random() * 3) + 1; // Incrementa de 1 a 3 planos por vez
        
        const nextStats = {
          // Oscilação em torno de 500
          premiumOnline: Math.max(490, Math.min(540, prev.premiumOnline + (Math.floor(Math.random() * 9) - 4))),
          // Oscilação em torno de 1500
          freeOnline: Math.max(1450, Math.min(1560, prev.freeOnline + (Math.floor(Math.random() * 13) - 6))),
          // Incrementos sincronizados
          menusToday: prev.menusToday + newPlans,
          menusMonth: prev.menusMonth + newPlans
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStats));
        return nextStats;
      });
    }, 4000); // Atualização a cada 4 segundos para ser visível e elegante

    return () => clearInterval(interval);
  }, []);

  const counterItems = [
    { 
      label: "Premium Online", 
      value: stats.premiumOnline, 
      icon: Crown, 
      color: "text-amber-500", 
      bg: "bg-amber-50" 
    },
    { 
      label: "Usuários Grátis", 
      value: stats.freeOnline, 
      icon: Users, 
      color: "text-primary", 
      bg: "bg-emerald-50" 
    },
    { 
      label: "Planos Hoje", 
      value: stats.menusToday.toLocaleString("pt-BR"), 
      icon: Utensils, 
      color: "text-accent", 
      bg: "bg-orange-50" 
    },
    { 
      label: "Este Mês (planos completos)", 
      value: stats.menusMonth.toLocaleString("pt-BR"), 
      icon: Calendar, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    }
  ];

  return (
    <section className="w-full py-10 bg-white border-y border-zinc-100 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {counterItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <motion.div 
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-black/5`}
              >
                <item.icon size={24} />
              </motion.div>
              
              <div className="relative h-9 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.value}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="text-2xl md:text-3xl font-black text-foreground tabular-nums tracking-tight"
                  >
                    {item.value}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2 max-w-[150px] mx-auto leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveCounter;