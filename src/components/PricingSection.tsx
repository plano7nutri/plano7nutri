"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, ShieldCheck } from "lucide-react";

interface PricingSectionProps {
  isDark?: boolean;
}

const PricingSection = ({ isDark = false }: PricingSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(1); // Padrão: Plano Mensal (índice 1)

  const plans = [
    {
      title: "Cardápio Único",
      price: "9,90",
      period: "pagamento único",
      features: [
        "Cardápio completo de 7 dias",
        "Lista de compras personalizada",
        "Baseado no seu metabolismo",
        "Alimentos acessíveis brasileiros",
        "Entrega via WhatsApp",
      ],
      buttonText: "Quero meu Cardápio — R$ 9,90",
      highlight: false,
      url: "https://pay.hotmart.com/X104499776T?checkoutMode=10",
    },
    {
      title: "Plano Mensal",
      price: "19,90",
      period: "por mês",
      features: [
        "Tudo do Cardápio Único +",
        "Cardápios novos toda semana",
        "Lista de compras semanal",
        "Ajustes conforme seu progresso",
        "Suporte prioritário no WhatsApp",
        "Cancele quando quiser",
      ],
      buttonText: "Assinar Agora — R$ 19,90/mês",
      highlight: true,
      badge: "Mais Popular",
      url: "https://pay.hotmart.com/R104498424U?checkoutMode=10",
    },
  ];

  const activePlan = plans[activeIndex];

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Turbine seu resultado com um plano completo
        </h3>
        <p className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Escolha o plano ideal para continuar sua jornada
        </p>
      </div>

      {/* Seletor de Planos */}
      <div className={`flex justify-center mb-10 p-1.5 rounded-2xl w-fit mx-auto border ${
        isDark ? 'bg-zinc-900/50 border-emerald-500/10' : 'bg-zinc-100 border-zinc-200'
      }`}>
        <button
          onClick={() => setActiveIndex(1)}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeIndex === 1
              ? "bg-primary text-white shadow-md"
              : isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          Plano Mensal
        </button>
        <button
          onClick={() => setActiveIndex(0)}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeIndex === 0
              ? "bg-primary text-white shadow-md"
              : isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          Cardápio Único
        </button>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: activeIndex === 1 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeIndex === 1 ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className={`relative flex flex-col p-8 rounded-3xl bg-white border-2 transition-all duration-300 ${
              activePlan.highlight 
                ? "border-primary shadow-lg ring-4 ring-primary/5" 
                : "border-border shadow-sm hover:shadow-md"
            }`}
          >
            {activePlan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-md">
                <Star size={12} className="fill-current" />
                {activePlan.badge}
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-lg font-bold text-zinc-900 mb-2">{activePlan.title}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-zinc-900">R$</span>
                <span className="text-4xl font-black text-zinc-900">{activePlan.price}</span>
                <span className="text-xs text-zinc-500 font-medium ml-1">/{activePlan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {activePlan.features.map((feature, fIndex) => (
                <li key={fIndex} className="flex items-start gap-3">
                  <div className="mt-0.5 p-0.5 rounded-full bg-emerald-50 text-primary">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium leading-tight text-zinc-600">
                    {feature === "Tudo do Cardápio Único +" ? (
                      <><strong>Tudo do Cardápio Único</strong> +</>
                    ) : (
                      feature
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={activePlan.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 rounded-2xl font-bold text-sm text-center transition-all ${
                activePlan.highlight
                  ? "bg-primary text-white hover:bg-primary/90 shadow-glow"
                  : "bg-transparent border-2 border-primary text-primary hover:bg-primary/5"
              }`}
            >
              {activePlan.buttonText}
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={`flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
        <ShieldCheck size={14} className="text-emerald-500" />
        Pagamento seguro · Sem taxas ocultas · Cancele quando quiser
      </div>
    </section>
  );
};

export default PricingSection;