"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  HelpCircle, 
  ChevronDown, 
  Zap, 
  Calculator, 
  MessageCircle, 
  Utensils, 
  ShieldCheck,
  Info
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
  isDark?: boolean;
}

const FAQSection = ({ isDark = false }: FAQSectionProps) => {
  const faqs = [
    {
      question: "Como o Plano 7 funciona exatamente?",
      answer: "O processo é dividido em 4 etapas: 1. Coleta de dados biométricos (peso, altura, idade); 2. Cálculo do seu metabolismo real (TMB e GET); 3. Ajuste calórico baseado no seu objetivo (emagrecimento, ganho ou manutenção); 4. Geração de um cardápio de 7 dias com alimentos brasileiros acessíveis enviado diretamente para seu WhatsApp.",
      icon: <Zap className="w-4 h-4" />
    },
    {
      question: "O que são TMB e GET?",
      answer: "A TMB (Taxa Metabólica Basal) é o quanto seu corpo gasta de energia apenas para existir. O GET (Gasto Energético Total) soma sua TMB com seu nível de atividade física. Nós usamos a fórmula de Mifflin-St Jeor, uma das mais precisas da ciência nutricional moderna, para garantir que seu plano seja matematicamente perfeito para você.",
      icon: <Calculator className="w-4 h-4" />
    },
    {
      question: "Posso substituir os alimentos sugeridos?",
      answer: "Sim! O Plano 7 foca em macronutrientes (proteínas, carboidratos e gorduras). Se o plano sugere frango, você pode substituir por outra proteína equivalente (como ovo ou carne magra) mantendo as quantidades. O objetivo é dar flexibilidade usando o que você já tem na geladeira.",
      icon: <Utensils className="w-4 h-4" />
    },
    {
      question: "Por que recebo o plano no WhatsApp?",
      answer: "Praticidade. Queremos que seu plano esteja no seu bolso quando você estiver no mercado ou no restaurante. Sem aplicativos pesados para baixar ou senhas para lembrar — tudo direto onde você já se comunica diariamente.",
      icon: <MessageCircle className="w-4 h-4" />
    },
    {
      question: "Por que não posso editar meus dados a qualquer momento?",
      answer: "Resultados reais exigem constância. Todo o seu planejamento é baseado em cálculos científicos rigorosos sobre sua biometria atual. Alterar esses dados no meio do processo invalidaria sua estratégia nutricional e jogaria fora todo o esforço de adaptação do seu metabolismo. Para garantir sua segurança e a eficácia do método, o sistema permite novas atualizações apenas após a conclusão de cada ciclo de 7 dias.",
      icon: <Info className="w-4 h-4" />
    },
    {
      question: "O Plano 7 substitui um nutricionista?",
      answer: "Não. O Plano 7 é uma ferramenta tecnológica de planejamento e organização alimentar. Embora usemos cálculos científicos precisos, não substituímos o acompanhamento clínico individualizado de um profissional de saúde, especialmente para casos de patologias ou condições específicas.",
      icon: <ShieldCheck className="w-4 h-4" />
    }
  ];

  return (
    <section className={`mt-16 mb-12 p-8 rounded-3xl border transition-all duration-300 ${
      isDark 
        ? "bg-zinc-900/40 border-emerald-500/10 backdrop-blur-sm" 
        : "bg-white border-zinc-100 shadow-sm"
    }`}>
      <div className="flex flex-col items-center text-center mb-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${
          isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"
        }`}>
          <HelpCircle size={12} />
          Dúvidas Frequentes
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Tudo o que você precisa saber
        </h3>
        <p className={`text-sm font-medium max-w-md ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Entenda a ciência e a tecnologia por trás do seu planejamento nutricional.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className={`border rounded-2xl px-4 transition-all duration-200 ${
              isDark 
                ? "border-emerald-500/5 bg-emerald-950/10 data-[state=open]:border-emerald-500/20" 
                : "border-zinc-100 bg-zinc-50/50 data-[state=open]:border-primary/20"
            }`}
          >
            <AccordionTrigger className={`hover:no-underline py-4 text-left gap-4 ${
              isDark ? "text-zinc-200 hover:text-emerald-400" : "text-zinc-700 hover:text-primary"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${
                  isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"
                }`}>
                  {faq.icon}
                </div>
                <span className="text-sm font-bold leading-tight">{faq.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className={`text-sm leading-relaxed pb-4 pl-11 ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className={`mt-10 pt-8 border-t text-center ${
        isDark ? "border-emerald-500/10" : "border-zinc-100"
      }`}>
        <p className={`text-xs font-medium ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
          Ainda tem dúvidas? Entre em contato pelo e-mail: <br className="sm:hidden" />
          <span className={isDark ? "text-emerald-400" : "text-primary"}>contato_nutriia@inventiia.com.br</span>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;