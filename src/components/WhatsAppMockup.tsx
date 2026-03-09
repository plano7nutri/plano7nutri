"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, MoreVertical, CheckCheck, ChevronLeft, Camera, Mic } from "lucide-react";

const messages = [
  {
    sender: "user",
    text: "Quero começar meu plano 7 agora.",
    time: "12:05"
  },
  {
    sender: "vivi",
    text: "Olá *Você*, aqui é a *Vivi* novamente! 😊\n\nVou te enviar agora seu cardápio semanal baseado em:\n✅ *Objetivo Semanal*: Ganhar Massa Muscular (Hipertrofia)\n✅ *Restrições*: Nenhuma\n✅ *Preferências*: Nenhuma\n✅ *Meta de Calorias*: 1930 kcal\n✅ *Meta de água*: 2000 ml\n✅ *TMB*: 1220 kcal\n✅ *GET*: 1678 kcal\n✅ *Proteína dia*: 145g\n✅ *Carboidrato dia*: 241g\n✅ *Gordura do dia*: 43g",
    time: "12:05"
  },
  {
    sender: "vivi",
    text: "🥗 *CARDÁPIO SEMANAL PERSONALIZADO*\n\n*SEGUNDA-FEIRA*\n🍳 *Café da manhã*: Omelete (3 ovos) com queijo minas frescal (50g) e pão integral (2 fatias).\n🍎 *Lanche 10h*: Iogurte natural (170g) com aveia (2 colheres de sopa) e banana (1 unidade).\n🍽️ *Almoço*: Frango grelhado (180g), arroz integral (5 colheres de sopa), feijão (1 concha média), salada de folhas verdes e tomate à vontade.\n🥤 *Lanche 15h*: Sanduíche de pão integral (2 fatias) com atum em água (80g) e cenoura ralada.\n🌙 *Jantar*: Carne moída magra (180g), batata doce cozida (1 unidade média), brócolis cozido (4 colheres de sopa).",
    time: "12:06"
  },
  {
    sender: "vivi",
    text: "*TERÇA-FEIRA*\n🍳 *Café da manhã*: Tapioca (1 unidade) com ovos mexidos (3 ovos) e queijo minas frescal (50g).\n🍎 *Lanche 10h*: Maçã (1 unidade) e ovos cozidos (2 unidades).\n🍽️ *Almoço*: Carne bovina magra assada (180g), arroz branco (5 colheres de sopa), feijão (1 concha média), couve refogada (4 colheres de sopa).\n🥤 *Lanche 15h*: Vitamina de leite desnatado (200ml) com whey protein (1 scoop) e mamão (1 fatia média).\n🌙 *Jantar*: Frango desfiado (180g) com purê de abóbora (4 colheres de sopa) e salada de pepino e alface à vontade.",
    time: "12:06"
  },
  {
    sender: "vivi",
    text: "Mantenha o foco e a disciplina, *Você*! Cada refeição é um passo em direção aos seus objetivos. 💪\n\n🛍️ *Sua lista de compras personalizada está pronta!*\nCalculei cada quantidade com base no seu cardápio dos 7 dias. 💪",
    time: "12:08"
  },
  {
    sender: "vivi",
    text: "🛒 *LISTA DE COMPRAS SEMANAL*\n\n🥩 *PROTEÍNAS*:\n- Frango — 1130 g\n- Carne Bovina — 1100 g\n- Peixe — 360 g\n- Atum em água — 230 g\n- Carne Seca — 180 g\n\n🥦 *LEGUMES, VERDURAS & FRUTAS*:\n- Ovos — 24 unidades\n- Batata Docas — 2 unidades\n- E muito mais...",
    time: "12:08"
  },
  {
    sender: "vivi",
    text: "🎉 *Você* Seu cardápio personalizado está pronto!\n\n💬 *Quem cuida da alimentação cuida do futuro.*\nVocê já tomou a decisão mais importante — agora é só executar! 🔥\nFoco total em *Ganhar Massa Muscular (Hipertrofia)*! 💪",
    time: "12:08"
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
          // 5 segundos de animação de digitação conforme solicitado
          timeout = setTimeout(() => {
            setIsTyping(false);
            setCurrentMessages(prev => [...prev, nextMsg]);
            setMsgIndex(prev => prev + 1);
          }, 5000);
        } else {
          setCurrentMessages(prev => [...prev, nextMsg]);
          setMsgIndex(prev => prev + 1);
        }
      } else {
        // 6 segundos de espera antes de recomeçar conforme solicitado
        timeout = setTimeout(() => {
          setCurrentMessages([]);
          setMsgIndex(0);
        }, 6000);
      }
    };

    const actionTimeout = setTimeout(processNextMessage, msgIndex === 0 ? 500 : 2000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(actionTimeout);
    };
  }, [msgIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentMessages, isTyping]);

  const formatText = (text: string) => {
    const parts = text.split(/(\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return <strong key={i} className="font-bold">{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

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

        {/* iPhone Frame */}
        <div className="max-w-[320px] mx-auto bg-black rounded-[3rem] border-[12px] border-zinc-900 shadow-2xl h-[650px] flex flex-col relative overflow-hidden ring-1 ring-zinc-800">
          {/* Top Notch Area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-30 flex items-center justify-center">
            <div className="w-10 h-1 bg-zinc-800 rounded-full mb-1" />
          </div>

          {/* iOS Header */}
          <div className="bg-[#f6f6f6] pt-8 pb-3 px-3 flex items-center justify-between border-b border-zinc-200 z-20">
            <div className="flex items-center gap-1">
              <ChevronLeft size={22} className="text-[#007AFF] cursor-pointer" />
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden border border-zinc-300">
                    <img src="/favicon.svg" alt="Vivi" className="w-full h-full object-cover p-1" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-zinc-900 leading-tight">Vivi 🤖</span>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    {isTyping ? "digitando..." : "online"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#007AFF]">
              <Video size={20} strokeWidth={2.5} />
              <Phone size={18} strokeWidth={2.5} />
            </div>
          </div>

          {/* Chat Background */}
          <div 
            ref={scrollRef}
            className="flex-1 p-3 overflow-y-auto space-y-3 relative scroll-area-mockup"
            style={{ 
              backgroundColor: "#E5DDD5",
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
                  <div className={`max-w-[88%] px-3 py-2 rounded-[14px] shadow-sm text-[13.5px] relative ${
                    msg.sender === 'user' 
                      ? 'bg-[#E1FFC7] rounded-tr-none' 
                      : 'bg-white rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap text-[#303030] leading-snug pb-1">
                      {formatText(msg.text)}
                    </p>
                    <div className="flex items-center justify-end gap-1 -mt-1">
                      <span className="text-[9px] text-zinc-400 font-medium">{msg.time}</span>
                      {msg.sender === 'user' && <CheckCheck size={13} className="text-[#34B7F1]" />}
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
                  <div className="bg-white px-3 py-2 rounded-[14px] rounded-tl-none shadow-sm">
                    <div className="flex gap-1 items-center h-4">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* iOS Input Bar */}
          <div className="bg-[#f6f6f6] px-3 py-3 flex items-center gap-3 border-t border-zinc-200">
            <div className="text-[#007AFF]"><span className="text-2xl font-light">+</span></div>
            <div className="flex-1 bg-white rounded-full px-4 py-1.5 text-zinc-300 text-sm border border-zinc-200">
              Mensagem
            </div>
            <div className="flex items-center gap-4 text-[#007AFF]">
              <Camera size={20} />
              <Mic size={20} />
            </div>
          </div>

          {/* iPhone Home Bar */}
          <div className="bg-[#f6f6f6] pb-2 flex justify-center">
            <div className="w-32 h-1 bg-black rounded-full opacity-20" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scroll-area-mockup::-webkit-scrollbar {
          width: 5px;
        }
        .scroll-area-mockup::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroll-area-mockup::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default WhatsAppMockup;