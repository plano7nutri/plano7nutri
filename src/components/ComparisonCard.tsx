"use client";

import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, Zap, CheckCircle2, XCircle, TrendingDown, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const ComparisonCard = () => {
  const location = useLocation();
  const isMetabolismoPage = location.pathname === "/metabolismo";
  
  const checkoutUrls = {
    semanal: "https://pay.hotmart.com/X104499776T?checkoutMode=10",
    mensal: "https://pay.hotmart.com/R104498424U?checkoutMode=10"
  };

  return (
    <motion.div 
      id="economia-real"
      style={{ scrollMarginTop: "100px" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-emerald-500/30 shadow-2xl w-full max-w-5xl mx-auto"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[80px] -ml-32 -mb-32 rounded-full" />

      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-500/20">
            <TrendingDown size={12} />
            Economia Real & Inteligência
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight max-w-3xl">
            Nutricionistas cobram em média <span className="text-red-400 underline decoration-red-400/30">R$ 200</span> só para calcular seu metabolismo
          </h2>
          <p className="text-zinc-200 mt-4 text-sm md:text-base font-medium max-w-2xl">
            E você sai de lá só com os números na mão e um cardápio igual para qualquer paciente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Traditional Side */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400">
                <Stethoscope size={20} />
              </div>
              <span className="text-sm font-bold text-zinc-200 uppercase tracking-widest">Método Tradicional</span>
            </div>
            <ul className="space-y-4 flex-1">
              <li className="flex items-start gap-3 text-zinc-300 text-sm">
                <XCircle size={18} className="text-red-500/50 shrink-0 mt-0.5" />
                <span>Custo médio de R$ 200,00 por consulta</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-300 text-sm">
                <XCircle size={18} className="text-red-500/50 shrink-0 mt-0.5" />
                <span>Cardápios genéricos e repetitivos</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-300 text-sm">
                <XCircle size={18} className="text-red-500/50 shrink-0 mt-0.5" />
                <span>Sem lista de compras automatizada</span>
              </li>
            </ul>
          </div>

          {/* Plano 7 Side */}
          <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl p-6 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-emerald-500 text-emerald-950 text-[9px] font-black px-4 py-1 uppercase tracking-tighter rounded-bl-xl">
              Melhor Escolha
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-500 rounded-xl text-emerald-950">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Plano 7 Elite</span>
            </div>
            <ul className="space-y-4 flex-1">
              <li className="flex items-start gap-3 text-zinc-200 text-sm font-medium">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Cardápio pronto e lista de compras calculada</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-200 text-sm font-medium">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Ajustado 100% ao seu metabolismo real</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-200 text-sm font-medium">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Entrega instantânea no seu WhatsApp</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-white/5 text-center">
          {isMetabolismoPage && (
            <p className="text-white font-bold text-lg mb-8 animate-pulse">
              Seja rápido, seu corpo não espera e está pedindo ajuda, clique no botão abaixo.
            </p>
          )}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            <motion.a 
              href={checkoutUrls.semanal}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white/5 border border-white/10 transition-all group min-w-[220px]"
            >
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Plano Semanal</span>
              <span className="text-3xl font-black text-white">R$ 9,90</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase mt-3 flex items-center gap-1.5">
                Comprar Agora <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>

            <div className="h-12 w-px bg-white/10 hidden md:block" />

            <motion.a 
              href={checkoutUrls.mensal}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 transition-all group min-w-[220px] shadow-lg shadow-emerald-500/5"
            >
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Plano Mensal</span>
              <span className="text-3xl font-black text-emerald-400">R$ 19,90</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase mt-3 flex items-center gap-1.5">
                Assinar Agora <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>
          </div>
          
          <div className="mt-8 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 inline-block">
            <p className="text-lg md:text-xl font-bold text-white italic">
              "Começa agora, o preço não é mais o problema!!!"
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonCard;