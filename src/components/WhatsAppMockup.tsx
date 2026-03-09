"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, MoreVertical, CheckCheck, ChevronLeft, Search } from "lucide-react";

const messages = [
  {
    sender: "user",
    text: "Quero começar meu plano 7 agora.",
    time: "10:00"
  },
  {
    sender: "vivi",
    text: "Olá Você, aqui é a Vivi novamente! 😊\n\nVou te enviar agora seu cardápio semanal baseado em:\n✅ Objetivo Semanal: Ganhar Massa Muscular (Hipertrofia)\n✅ Restrições: Nenhuma\n✅ Preferências: Nenhuma\n✅ Meta de Calorias: 1930 kcal\n✅ Meta de água: 2000 ml\n✅ TMB: 1220 kcal\n✅ GET: 1678 kcal\n✅ Proteína dia: 145g\n✅ Carboidrato dia: 241g\n✅ Gordura do dia: 43g\n━━━━━━━━━━━━━━━━━━━━",
    time: "10:00"
  },
  {
    sender: "vivi",
    text: "🥗 CARDÁPIO SEMANAL PERSONALIZADO\n\nSEGUNDA-FEIRA\n🍳 Café da manhã: Omelete (3 ovos) com queijo minas frescal (50g) e pão integral (2 fatias).\n🍎 Lanche 10h: Iogurte natural (170g) com aveia (2 colheres de sopa) e banana (1 unidade).\n🍽️ Almoço: Frango grelhado (180g), arroz integral (5 colheres de sopa), feijão (1 concha média), salada de folhas verdes e tomate à vontade.\n🥤 Lanche 15h: Sanduíche de pão integral (2 fatias) com atum em água (80g) e cenoura ralada.\n🌙 Jantar: Carne moída magra (180g), batata doce cozida (1 unidade média), brócolis cozido (4 colheres de sopa).\n\nTERÇA-FEIRA\n🍳 Café da manhã: Tapioca (1 unidade) com ovos mexidos (3 ovos) e queijo minas frescal (50g).\n🍎 Lanche 10h: Maçã (1 unidade) e ovos cozidos (2 unidades).\n🍽️ Almoço: Carne bovina magra assada (180g), arroz branco (5 colheres de sopa), feijão (1 concha média), couve refogada (4 colheres de sopa).\n🥤 Lanche 15h: Vitamina de leite desnatado (200ml) com whey protein (1 scoop) e mamão (1 fatia média).\n🌙 Jantar: Frango desfiado (180g) com purê de abóbora (4 colheres de sopa) e salada de pepino e alface à vontade.\n\n...\n(Cardápio completo de 7 dias enviado)",
    time: "10:01"
  },
  {
    sender: "vivi",
    text: "━━━━━━━━━━━━━━━━━━━━\nMantenha o foco e a disciplina, Você! Cada refeição é um passo em direção aos seus objetivos. 💪\n\n🛍️ Sua lista de compras personalizada está pronta!\nCalculei cada quantidade com base no seu cardápio dos 7 dias. 💪",
    time: "10:01"
  },
  {
    sender: "vivi",
    text: "🛒 LISTA DE COMPRAS SEMANAL\n\n🥩 PROTEÍNAS:\n- Frango — 1130 g\n- Carne Bovina — 1100 g\n- Peixe — 360 g\n- Atum em água — 230 g\n- Carne Seca — 180 g\n\n🥦 VEGETAIS & FRUTAS:\n- Ovos — 24 unidades\n- Batata Doce — 2 unidades\n- E muito mais...\n\n━━━━━━━━━━━━━━━━━━━━",
    time: "10:02"
  },
  {
    sender: "vivi",
    text: "🎉 Você Seu cardápio personalizado está pronto!\n\n💬 Quem cuida da alimentação cuida do futuro.\nVocê já tomou a decisão mais importante — agora é só executar! 🔥\nFoco total em Ganhar Massa Muscular (Hipertrofia)! 💪",
    time: "10:02"
  }
];

const WhatsAppMockup = () => {
  const [currentMessages, setCurrentMessages] = useState<typeof messages>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const processNextMessage = () => {
      if (msgIndex < messages.length) {
        const nextMsg = messages[msgIndex];
        
        if (nextMsg.sender === "vivi") {
          setIsTyping(true);
          // 2 segundos digitando
          timeout = setTimeout(() => {
            setIsTyping(false);
            setCurrentMessages(prev => [...prev, nextMsg]);
            setMsgIndex(prev => prev + 1);
          }, 2000);
        } else {
          // Mensagem do usuário aparece direto
          setCurrentMessages(prev => [...prev, nextMsg]);
          setMsgIndex(prev => prev + 1);
        }
      } else {
        // Reinicia o loop após 5 segundos
        timeout = setTimeout(() => {
          setCurrentMessages([]);
          setMsgIndex(0);
        }, 5000);
      }
    };

    // Delay de 4 segundos entre as ações (ou o tempo total que queremos)
    // Se não estiver digitando nem reiniciando, espera o intervalo
    const actionTimeout = setTimeout(processNextMessage, msgIndex === 0 ? 500 : 2000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(actionTimeout);
    };
  }, [msgIndex]);

  // Scroll automático suave
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentMessages, isTyping]);

  return (
    <section className="py-20 bg-zinc-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Veja como chega no seu WhatsApp
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Tudo organizado, prático e pronto para você começar.
          </p>
        </div>

        <div className="max-w-[390px] mx-auto bg-[#E5DDD5] rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl h-[600px] flex flex-col relative overflow-hidden">
          {/* Header Realista do WhatsApp */}
          <div className="bg-[#075E54] pt-10 pb-3 px-3 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2">
              <ChevronLeft size={20} className="cursor-pointer" />
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden border border-white/10">
                  <img src="/favicon.svg" alt="Vivi" className="w-full h-full object-cover p-1" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#075E54] rounded-full"></div>
              </div>
              <div className="flex flex-col ml-1">
                <span className="font-bold text-sm flex items-center gap-1">
                  Vivi 🤖
                </span>
                <span className="text-[10px] opacity-90 leading-tight">
                  {isTyping ? "digitando..." : "online"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 mr-1">
              <Video size={18} className="opacity-90" />
              <Phone size={18} className="opacity-90" />
              <MoreVertical size={18} className="opacity-90" />
            </div>
          </div>

          {/* Área do Chat com Textura */}
          <div 
            ref={scrollRef}
            className="flex-1 p-3 overflow-y-auto space-y-2 relative"
            style={{ 
              backgroundColor: "#ECE5DD",
              backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
              backgroundBlendMode: "overlay",
              backgroundSize: "400px"
            }}
          >
            <AnimatePresence>
              {currentMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-3 py-1.5 rounded-lg shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-sm relative ${
                    msg.sender === 'user' 
                      ? 'bg-[#DCF8C6] rounded-tr-none' 
                      : 'bg-white rounded-tl-none'
                  }`}>
                    {/* Triângulo do Balão */}
                    <div className={`absolute top-0 w-2 h-2 ${
                      msg.sender === 'user' 
                        ? '-right-1.5 border-l-[10px] border-l-[#DCF8C6] border-b-[10px] border-b-transparent' 
                        : '-left-1.5 border-r-[10px] border-r-white border-b-[10px] border-b-transparent'
                    }`} />
                    
                    <p className="whitespace-pre-wrap text-[#303030] leading-relaxed font-medium pb-1 pr-12">
                      {msg.text}
                    </p>
                    
                    <div className="absolute bottom-1 right-1.5 flex items-center gap-1">
                      <span className="text-[10px] text-zinc-400 font-medium">{msg.time}</span>
                      {msg.sender === 'user' && <CheckCheck size={14} className="text-[#34B7F1]" />}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-zinc-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-zinc-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-zinc-400 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Mockup do WhatsApp */}
          <div className="bg-[#F0F0F0] px-2 py-3 flex items-center gap-2 border-t border-zinc-200">
            <div className="flex-1 bg-white rounded-full px-4 py-2 text-zinc-400 text-sm shadow-sm flex items-center justify-between">
              <span>Mensagem</span>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#00897B] flex items-center justify-center text-white shadow-sm">
              <Phone size={20} className="fill-current" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppMockup;