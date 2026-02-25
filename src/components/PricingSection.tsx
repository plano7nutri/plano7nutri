"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Star, ShieldCheck } from "lucide-react";

interface PricingSectionProps {
  isDark?: boolean;
}

const PricingSection = ({ isDark = false }: PricingSectionProps) => {
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

  return (
    <section className="mt-12 mb-8">
      <div className="text-center mb-10">
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Turbine seu resultado com um plano completo
        </h3>
        <p className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Escolha o plano ideal para continuar sua jornada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8 }}
            className={`relative flex flex-col p-8 rounded-3xl bg-white border-2 transition-all duration-300 ${
              plan.highlight 
                ? "border-primary shadow-lg ring-4 ring-primary/5" 
                : "border-border shadow-sm hover:shadow-md"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-md">
                <Star size={12} className="fill-current" />
                {plan.badge}
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-lg font-bold text-zinc-900 mb-2">{plan.title}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-zinc-900">R$</span>
                <span className="text-4xl font-black text-zinc-900">{plan.price}</span>
                <span className="text-xs text-zinc-500 font-medium ml-1">/{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, fIndex) => (
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
              href={plan.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 rounded-2xl font-bold text-sm text-center transition-all ${
                plan.highlight
                  ? "bg-primary text-white hover:bg-primary/90 shadow-glow"
                  : "bg-transparent border-2 border-primary text-primary hover:bg-primary/5"
              }`}
            >
              {plan.buttonText}
            </a>
          </motion.div>
        ))}
      </div>

      <div className={`flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
        <ShieldCheck size={14} className="text-emerald-500" />
        Pagamento seguro · Sem taxas ocultas · Cancele quando quiser
      </div>
    </section>
  );
};

export default PricingSection;