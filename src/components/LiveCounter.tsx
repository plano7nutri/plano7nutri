"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Crown, Utensils, Calendar, Zap } from "lucide-react";

const STORAGE_KEY = "plano7_live_stats_v3";

const LiveCounter = () => {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    return {
      premiumOnline: 508,
      freeOnline: 1342,
      menusToday: 1587,
      menusMonth: 27412
    };
  });

  useEffect(() => {
    const updateStats = () => {
      const increment = Math.floor(Math.random() * 2) + 1;
      
      // Atualização escalonada com delays
      // 1. Premium Online
      setTimeout(() => {
        setStats(prev => {
          const next = {
            ...prev,
            premiumOnline: Math.max(495, Math.min(535, prev.premiumOnline + (Math.floor(Math.random() * 5) - 2)))
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      }, 0);

      // 2. Usuários Grátis (Mantendo em torno de 1300-1400)
      setTimeout(() => {
        setStats(prev => {
          const next = {
            ...prev,
            freeOnline: Math.max(1310, Math.min(1390, prev.freeOnline + (Math.floor(Math.random() * 7) - 3)))
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      }, 1000);

      // 3. Planos Hoje (Gira em torno de 1500-1600, sempre acima dos usuários online)
      setTimeout(() => {
        setStats(prev => {
          const next = {
            ...prev,
            menusToday: Math.max(1520, Math.min(1650, prev.menusToday + (Math.floor(Math.random() * 3) - 1)))
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      }, 2000);

      // 4. Este Mês
      setTimeout(() => {
        setStats(prev => {
          const next = {
            ...prev,
            menusMonth: prev.menusMonth + increment
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      }, 3000);
    };

    const mainInterval = setInterval(updateStats, 8000);
    updateStats();

    return () => clearInterval(mainInterval);
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
    <section className="w-full py-12 bg-white border-y border-zinc-100 shadow-sm overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest mb-3 border border-primary/10">
            <Zap size={12} className="fill-current" />
            Atividade em Tempo Real
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Nossa comunidade em movimento
          </h2>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            Acompanhe o impacto do Plano 7 em todo o Brasil agora mesmo.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {counterItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  delay: index * 0.5 
                }}
                className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-black/5`}
              >
                <item.icon size={22} />
              </motion.div>
              
              <div className="relative h-9 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.value}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="text-2xl md:text-3xl font-black text-foreground tabular-nums tracking-tighter"
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