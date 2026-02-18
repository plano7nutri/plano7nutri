"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthReminderProps {
  isPremium?: boolean;
}

const HealthReminder = ({ isPremium = false }: HealthReminderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mb-10 overflow-hidden rounded-[2rem] border-2 shadow-sm transition-all duration-300",
        isPremium 
          ? "bg-amber-500/5 border-amber-500/20" 
          : "bg-amber-50 border-amber-200"
      )}
    >
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
        {/* Icon Container */}
        <div className={cn(
          "shrink-0 p-4 rounded-2xl shadow-inner",
          isPremium ? "bg-amber-500/10 text-amber-500" : "bg-white text-amber-600"
        )}>
          <ShieldAlert size={32} className="animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className={cn(
            "font-black uppercase tracking-[0.2em] text-[10px]",
            isPremium ? "text-amber-500/70" : "text-amber-700/70"
          )}>
            Protocolo de Segurança
          </h3>
          <p className={cn(
            "text-sm md:text-base font-medium leading-relaxed max-w-2xl",
            isPremium ? "text-zinc-200" : "text-zinc-700"
          )}>
            O sucesso do Plano 7 depende do seu compromisso real. Para alcançar resultados verdadeiros, siga seu planejamento personalizado à risca.
          </p>
        </div>

        {/* Badge Slogan */}
        <div className="shrink-0 pt-2 md:pt-0">
          <span className={cn(
            "inline-flex items-center justify-center px-8 py-4 rounded-2xl font-black text-sm md:text-lg tracking-tight uppercase shadow-lg transition-transform hover:scale-105",
            isPremium 
              ? "bg-amber-500 text-emerald-950 shadow-amber-500/20" 
              : "bg-amber-600 text-white shadow-amber-600/20"
          )}>
            Aqui não negociamos saúde
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthReminder;