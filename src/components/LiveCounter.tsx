"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Crown, Utensils, Calendar } from "lucide-react";

const STORAGE_KEY = "plano7_live_stats";

const LiveCounter = () => {
  // Inicializa com valores base ou recupera do localStorage
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    return {
      premiumOnline: 512,
      freeOnline: 1487,
      menusToday: 2431,
      menusMonth: 27412 // Valor mensal ajustado para a casa dos 27k
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const nextStats = {
          premiumOnline: Math.max(490, Math.min(540, prev.premiumOnline + (Math.floor(Math.random() * 5) - 2))),
          freeOnline: Math.max(1450, Math.min(1550, prev.freeOnline + (Math.floor(Math.random() * 9) - 4))),
          menusToday: prev.menusToday + (Math.random() > 0.6 ? 1 : 0),
          menusMonth: prev.menusMonth + (Math.random() > 0.95 ? 1 : 0)
        };
        
        // Persiste os novos valores
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStats));
        return nextStats;
      });
    }, 3500);

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
      label: "Este Mês", 
      value: stats.menusMonth.toLocaleString("pt-BR"), 
      icon: Calendar, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    }
  ];

  return (
    <section className="w-full py-8 bg-white border-y border-zinc-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {counterItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-full flex items-center justify-center mb-3 shadow-sm`}>
                <item.icon size={20} />
              </div>
              
              <div className="relative h-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xl md:text-2xl font-black text-foreground tabular-nums"
                  >
                    {item.value}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
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