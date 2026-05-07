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
  Info,
  AlertTriangle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FAQSectionProps {
  isDark?: boolean;
}

const FAQSection = ({ isDark = false }: FAQSectionProps) => {
  const faqs = [
    {
      id: "edit-lock",
      question: "Por que não posso editar meus dados a qualquer momento?",
      answer: "Resultados reais exigem constância. Todo o seu planejamento é baseado em cálculos científicos rigorosos sobre sua biometria atual. Alterar esses dados no meio do processo invalidaria sua estratégia nutricional e jogaria fora todo o esforço de adaptação do seu metabolismo. Para garantir sua segurança e a eficácia do método, o sistema permite novas atualizações apenas após a conclusão de cada ciclo de 7 dias.",
      icon: <Info className="w-5 h-5" />,
      featured: true
    },
    {
      id: "how-it-works",
      question: "Como o Plano 7 funciona exatamente?",
      answer: "O processo é dividido em 4 etapas: 1. Coleta de dados biométricos (peso, altura, idade); 2. Cálculo do seu metabolismo real (TMB e GET); 3. Ajuste calórico baseado no seu objetivo (emagrecimento, ganho ou manutenção); 4. Geração de um cardápio de 7 dias com alimentos brasileiros acessíveis enviado diretamente para seu WhatsApp.",
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: "tmb-get",
      question: "O que são TMB e GET?",
      answer: "A TMB (Taxa Metabólica Basal) é o quanto seu corpo gasta de energia apenas para existir. O GET (Gasto Energético Total) soma sua TMB com seu nível de atividade física. Nós usamos a fórmula de Mifflin-St Jeor, uma das mais precisas da ciência nutricional moderna, para garantir que seu plano seja matematicamente perfeito para você.",
      icon: <Calculator className="w-5 h-5" />
    },
    {
      id: "subs",
      question: "Posso substituir os alimentos sugeridos?",
      answer: "Não! Resultados reais exigem o seguimento exato do protocolo gerado. Cada alimento e porção no seu Plano 7 foi matematicamente calculado especificamente para o seu metabolismo e objetivo. Alterar ingredientes ou quantidades invalida a estratégia nutricional e compromete o resultado final esperado em 7 dias. Aqui, não negociamos o método.",
      icon: <Utensils className="w-5 h-5" />
    },
    {
      id: "whatsapp",
      question: "Por que recebo o plano no WhatsApp?",
      answer: "Praticidade. Queremos que seu plano esteja no seu bolso quando você estiver no mercado ou no restaurante. Sem aplicativos pesados para baixar ou senhas para lembrar — tudo direto onde você já se comunica diariamente.",
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: "medical",
      question: "O Plano 7 substitui um nutricionista?",
      answer: "Não. O Plano 7 é uma ferramenta tecnológica de planejamento e organização alimentar. Embora usemos cálculos científicos precisos, não substituímos o acompanhamento clínico individualizado de um profissional de saúde, especialmente para casos de patologias ou condições específicas.",
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ];

  return (
    <section className={`w-full max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
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
        <h3 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
          Tudo o que você precisa saber
        </h3>
        <p className={`text-base font-medium max-w-md ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Entenda a ciência e a tecnologia por trás do seu planejamento nutricional.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq) => (
          <AccordionItem 
            key={faq.id} 
            value={faq.id}
            className={cn(
              "border rounded-2xl px-4 sm:px-6 transition-all duration-300 relative overflow-hidden",
              faq.featured 
                ? isDark 
                  ? "border-amber-500/30 bg-amber-500/5 data-[state=open]:border-amber-500/50" 
                  : "border-amber-200 bg-amber-50/30 data-[state=open]:border-amber-400/50"
                : isDark 
                  ? "border-emerald-500/5 bg-emerald-950/10 data-[state=open]:border-emerald-500/20" 
                  : "border-zinc-100 bg-zinc-50/50 data-[state=open]:border-primary/20"
            )}
          >
            {faq.featured && (
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-amber-950 text-[9px] font-black uppercase tracking-tighter rounded-bl-xl flex items-center gap-1 shadow-sm z-10">
                <AlertTriangle size={10} />
                Informação Crucial
              </div>
            )}

            <AccordionTrigger className={cn(
              "hover:no-underline py-5 text-left gap-4",
              isDark 
                ? faq.featured ? "text-amber-400 hover:text-amber-300" : "text-zinc-100 hover:text-emerald-400" 
                : faq.featured ? "text-amber-800 hover:text-amber-900" : "text-zinc-800 hover:text-primary"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl shrink-0",
                  isDark 
                    ? faq.featured ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/10 text-emerald-400" 
                    : faq.featured ? "bg-amber-100 text-amber-600" : "bg-primary/10 text-primary"
                )}>
                  {faq.icon}
                </div>
                <span className="text-base sm:text-lg font-bold leading-snug">{faq.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn(
              "text-base sm:text-lg leading-relaxed pb-6 pl-0 sm:pl-14",
              isDark 
                ? faq.featured ? "text-zinc-100" : "text-zinc-300" 
                : faq.featured ? "text-zinc-900" : "text-zinc-700"
            )}>
              {faq.featured ? (
                <div className="flex flex-col gap-3">
                  <p className="font-medium italic opacity-95">{faq.answer}</p>
                  <div className={cn(
                    "mt-2 p-4 rounded-xl text-xs font-bold uppercase tracking-wide border",
                    isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-100 border-amber-200 text-amber-800"
                  )}>
                    Atenção: Novas atualizações só serão permitidas após 7 dias de uso.
                  </div>
                </div>
              ) : (
                faq.answer
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className={`mt-10 pt-8 border-t text-center ${
        isDark ? "border-emerald-500/10" : "border-zinc-100"
      }`}>
        <p className={`text-sm font-medium ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
          Ainda tem dúvidas? Entre em contato pelo e-mail: <br className="sm:hidden" />
          <span className={cn("font-bold", isDark ? "text-emerald-400" : "text-primary")}>contato_nutriia@inventiia.com.br</span>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;