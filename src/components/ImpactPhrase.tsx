"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Dumbbell, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImpactPhraseProps {
  goal: string;
  className?: string;
}

const ImpactPhrase = ({ goal, className }: ImpactPhraseProps) => {
  const safeGoal = goal || "";
  
  const isWeightLoss = safeGoal.toLowerCase().includes("perder") || 
                       safeGoal.toLowerCase().includes("emagrecer") || 
                       safeGoal === "lose_weight";
                       
  const isHypertrophy = safeGoal.toLowerCase().includes("ganhar") || 
                        safeGoal.toLowerCase().includes("hipertrofia") || 
                        safeGoal === "gain_muscle";

  const phrase = useMemo(() => {
    const weightLossPhrases = [
      "Você já tentou de tudo e o peso não sai — porque nenhuma dieta foi calculada pro SEU metabolismo. Agora você tem os números reais do seu corpo. O Plano 7 transforma isso em 7 dias de refeições exatas pra seu corpo finalmente perder gordura de verdade. Pega seu cardápio agora.",
      "Sabe aquela sensação de fazer tudo certo e a balança não mover? É porque sem um plano feito pro seu déficit específico, seu corpo não tem motivo pra mudar. Resolve isso hoje com o Plano 7.",
      "Você não precisa passar fome. Precisa comer certo pro seu corpo. Seus números estão calculados — o Plano 7 monta 7 dias de refeições que forçam seu corpo a usar gordura como energia. Começa agora."
    ];

    const hypertrophyPhrases = [
      "Você treina pesado mas o músculo não aparece como deveria. O problema não é o treino — é que sem bater os macros certos todo dia seu corpo não tem material pra construir. Pega o Plano 7 e faz seu esforço virar resultado.",
      "Cada treino sem a nutrição certa é esforço jogado fora. Seu corpo precisa bater as metas de macro todos os dias — e sem um plano isso não acontece. O Plano 7 resolve isso agora.",
      "Músculo se constrói na cozinha, não só na academia. Você já tem os macros — agora o Plano 7 coloca isso no prato refeição por refeição pelos próximos 7 dias. Fecha esse ciclo hoje."
    ];

    const healthyEatingPhrases = [
      "Todo dia a mesma dúvida: o que eu vou comer? Sem um plano você acaba comendo qualquer coisa e seu corpo sente. O Plano 7 organiza sua semana inteira com refeições simples calculadas pro seu metabolismo. Resolve sua semana agora.",
      "Inchaço, cansaço sem motivo e disposição zero têm um motivo — sua alimentação não está alinhada com o que seu corpo precisa. Seus números estão calculados. O Plano 7 muda isso ainda essa semana.",
      "Comer bem não é complicado quando alguém organiza por você. Seus números estão prontos — o Plano 7 transforma isso em 7 dias de refeições reais com lista de compras pronta no seu WhatsApp. Começa hoje."
    ];

    if (isWeightLoss) return weightLossPhrases[Math.floor(Math.random() * weightLossPhrases.length)];
    if (isHypertrophy) return hypertrophyPhrases[Math.floor(Math.random() * hypertrophyPhrases.length)];
    return healthyEatingPhrases[Math.floor(Math.random() * healthyEatingPhrases.length)];
  }, [isWeightLoss, isHypertrophy]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-3xl mb-8 border transition-all duration-300",
        isWeightLoss 
          ? "bg-orange-500/5 border-orange-500/20 text-orange-700 dark:text-zinc-200" 
          : isHypertrophy 
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-zinc-200"
            : "bg-primary/5 border-primary/20 text-zinc-700 dark:text-zinc-200",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-2xl shrink-0",
          isWeightLoss ? "bg-orange-500/10" : isHypertrophy ? "bg-emerald-500/10" : "bg-primary/10"
        )}>
          {isWeightLoss ? <Flame size={24} /> : isHypertrophy ? <Dumbbell size={24} /> : <Sparkles size={24} className="text-primary" />}
        </div>
        <p className="text-sm md:text-base font-medium leading-relaxed">
          {phrase}
        </p>
      </div>
    </motion.div>
  );
};

export default ImpactPhrase;