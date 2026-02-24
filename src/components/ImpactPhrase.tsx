"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImpactPhraseProps {
  goal: string;
  className?: string;
}

const ImpactPhrase = ({ goal, className }: ImpactPhraseProps) => {
  // Verificação de segurança para evitar crash se goal for nulo ou indefinido
  const safeGoal = goal || "";
  
  const isWeightLoss = safeGoal.toLowerCase().includes("perder") || 
                       safeGoal.toLowerCase().includes("emagrecer") || 
                       safeGoal === "lose_weight";
                       
  const isHypertrophy = safeGoal.toLowerCase().includes("ganhar") || 
                        safeGoal.toLowerCase().includes("hipertrofia") || 
                        safeGoal === "gain_muscle";

  if (!isWeightLoss && !isHypertrophy) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("p-6 rounded-3xl bg-primary/5 border border-primary/10 mb-8", className)}
      >
        <p className="text-sm md:text-base text-center font-medium leading-relaxed">
          ✨ <span className="font-bold">Equilíbrio Vital:</span> Nutrição é a base de tudo. Siga seu plano por 7 dias e sinta a clareza mental e a energia que um corpo bem nutrido pode proporcionar.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-3xl mb-8 border transition-all duration-300",
        isWeightLoss 
          ? "bg-orange-500/5 border-orange-500/20 text-orange-700 dark:text-orange-400" 
          : "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-2xl shrink-0",
          isWeightLoss ? "bg-orange-500/10" : "bg-emerald-500/10"
        )}>
          {isWeightLoss ? <Flame size={24} /> : <Dumbbell size={24} />}
        </div>
        <p className="text-sm md:text-base font-medium leading-relaxed">
          {isWeightLoss ? (
            <>
              <span className="font-black uppercase tracking-tight">Desafio de 7 Dias:</span> Siga este cardápio à risca e elimine até <span className="font-black">2kg de retenção e gordura</span> já nesta primeira semana. O seu resultado não é chute, é matemática.
            </>
          ) : (
            <>
              <span className="font-black uppercase tracking-tight">Construção Acelerada:</span> Músculo não cresce por acaso, cresce com cálculo. Bata essas <span className="font-black">metas diárias por 7 dias</span> e sinta a diferença real no volume e na força.
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
};

export default ImpactPhrase;