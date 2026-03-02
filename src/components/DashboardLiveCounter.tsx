"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Crown, Utensils, Calendar, Zap } from "lucide-react";

const STORAGE_KEY = "plano7_live_stats_v3";

const DashboardLiveCounter = () => {
  const [stats, setStats] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
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
      setStats(prev => {
        const next = {
          ...prev,
          premiumOnline: Math.max(495, Math.min(535, prev.premiumOnline + (Math.floor(Math.random() * 5) - 2))),
          freeOnline: Math.max(1310, Math.min(1390, prev.freeOnline + (Math.floor(Math.random() * 7) - 3))),
          menusToday: Math.max(1520, Math.min(1650, prev.menusToday + (Math.floor(Math.random() * 3) - 1))),
          menusMonth: prev.menusMonth + increment
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    };

    const interval = setInterval(updateStats, 8000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Premium Online", value: stats.premiumOnline, icon: Crown, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Usuários Grátis", value: stats.freeOnline, icon: Users, color: "text-primary", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Plano 7 Hoje", value: stats.menusToday, icon: Utensils, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "Plano 7 este mês", value: stats.menusMonth.toLocaleString("pt-BR"), icon: Calendar, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" }
  ];

  return (
    <div className="mb-10">
      <div className="flex flex-col gap-1 mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Atividade em Tempo Real</span>
        </div>
        <p className="text-xs font-bold text-zinc-500">Nossa comunidade em movimento.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl bg-white border ${item.border} shadow-sm`}>
            <div className={`p-2 rounded-xl ${item.bg} ${item.color} shrink-0`}>
              <item.icon size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="relative h-5 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.value}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="text-sm font-bold text-zinc-900 tabular-nums block tracking-normal"
                  >
                    {item.value}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-normal text-zinc-400 truncate">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLiveCounter;