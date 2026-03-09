"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, MoreVertical, CheckCheck, ChevronLeft, MessageCircle } from "lucide-react";

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
  const [visibleCount, setVisibleCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= messages.length) {
          return 0; // Restart loop
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount]);

  return (
    <section className="py-20 bg-zinc-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Veja como chega no seu WhatsApp
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Tudo organizado, prático e pronto para você começar.
          </p>
        </div>

        <div className="max-w-[420px] mx-auto bg-[#E5DDD5] rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl h-[650px] flex flex-col relative overflow-hidden">
          {/* Status Bar Mockup */}
          <div className="bg-[#075E54] pt-4 pb-2 px-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <ChevronLeft size={20} />
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <img src="/favicon.svg" alt="Vivi" className="w-full h-full object-cover p-1" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Vivi - Plano 7</span>
                <span className="text-[10px] opacity-80">online</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Video size={18} />
              <Phone size={18} />
              <MoreVertical size={18} />
            </div>
          </div>

          {/* Chat Content */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar"
            style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: "contain" }}
          >
            <AnimatePresence>
              {messages.slice(0, visibleCount).map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-lg shadow-sm text-sm relative ${
                    msg.sender === 'user' 
                      ? 'bg-[#DCF8C6] rounded-tr-none' 
                      : 'bg-white rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap text-zinc-800 leading-relaxed font-medium">
                      {msg.text}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-zinc-400">{msg.time}</span>
                      {msg.sender === 'user' && <CheckCheck size={14} className="text-blue-500" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Bar Mockup */}
          <div className="bg-[#F0F0F0] p-3 flex items-center gap-3">
            <div className="flex-1 bg-white rounded-full px-4 py-2 text-zinc-400 text-sm">
              Mensagem
            </div>
            <div className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center text-white">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                <MessageCircle size={20} className="fill-current" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppMockup;