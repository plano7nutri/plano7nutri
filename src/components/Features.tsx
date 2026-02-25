"use client";

import { motion } from "framer-motion";

const items = [
  {
    emoji: "🔥",
    title: "Cálculo do seu metabolismo",
    description: "TMB e GET calculados com precisão científica baseados nos seus dados reais"
  },
  {
    emoji: "🥗",
    title: "Cardápio de 7 dias completo",
    description: "Café da manhã, almoço, jantar e lanches — tudo organizado por dia"
  },
  {
    emoji: "🛒",
    title: "Lista de compras pronta",
    description: "Todos os ingredientes da semana em uma lista simples para você ir ao mercado"
  },
  {
    emoji: "🇧🇷",
    title: "Alimentos brasileiros acessíveis",
    description: "Arroz, feijão, frango, ovo — sem ingredientes importados ou caros"
  },
  {
    emoji: "⚡",
    title: "Entrega instantânea no WhatsApp",
    description: "Seu plano chega em segundos direto no seu celular, sem app para baixar"
  },
  {
    emoji: "🎯",
    title: "Respeitando seus objetivos",
    description: "Emagrecer, ganhar massa ou manter o peso — o plano é ajustado para você"
  }
];

const Features = () => {
  return (
    <section className="pt-12 pb-12 bg-[#F8F9FA]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-foreground mb-4"
          >
            Tudo que você recebe no seu plano
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground font-medium"
          >
            Simples, completo e direto no seu WhatsApp.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[2rem] mb-6">
                {item.emoji}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;