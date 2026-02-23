"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImpactPhraseProps {
  goal: string;
  className?: string;
}

const ImpactPhrase = ({ goal, className }: ImpactPhraseProps) => {
  const isWeightLoss = goal.toLowerCase().includes("perder") || goal.toLowerCase().includes("emagrecer") || goal === "lose_weight";
  const isHypertrophy = goal.toLowerCase().includes("ganhar") || goal.toLowerCase().includes("hipertrofia") || goal === "gain_muscle";

  if (!isWeightLoss && !isHypertrophy) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-[2rem] border-2 transition-all duration-300 mb-8",
        "bg-gradient-to-br from-primary/5 to-secondary/20 border-primary/10 shadow-sm",
        className
      )}
    >
      <p className="text-sm md:text-base leading-relaxed text-foreground/90 text-center md:text-left">
        {isWeightLoss ? (
          <>
            🔥 <strong className="text-primary">Desafio de 7 Dias:</strong> Siga este cardápio à risca e elimine até 2kg de retenção e gordura já nesta primeira semana. O seu resultado não é chute, é matemática.
          </>
        ) : (
          <>
            💪 <strong className="text-primary">Construção Acelerada:</strong> Músculo não cresce por acaso, cresce com cálculo. Bata essas metas diárias por 7 dias e sinta a diferença real no volume e na força.
          </>
        )}
      </p>
    </motion.div>
  );
};

export default ImpactPhrase;