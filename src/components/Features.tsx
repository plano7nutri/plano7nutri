"use client";

import { motion } from "framer-motion";

const freeItems = [
  {
    emoji: "🔥",
    title: "Cálculo do seu metabolismo",
    description: "Conheça seu metabolismo com precisão científica baseados nos seus dados reais."
  },
  {
    emoji: "🔐",
    title: "Área de membros grátis",
    description: "Acesse seus cálculos e histórico a qualquer momento usando apenas seu WhatsApp"
  }
];

const planItems = [
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
    emoji: "💎",
    title: "Cálculo metabólico dinâmico",
    description: "Recalcule seu metabolismo sempre que seu peso mudar para manter o plano 100% eficiente"
  },
  {
    emoji: "🔑",
    title: "Área VIP exclusiva",
    description: "Seu histórico completo de cardápios e listas sempre disponíveis na palma da mão"
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
  },
  {
    emoji: "🎁",
    title: "Bônus e Receitas da Vivi",
    description: "Dicas exclusivas e receitas sazonais para variar seu planejamento com saúde"
  }
];

const Features = () => {
  return (
    <section className="pt-12 pb-12 bg-[#F8F9FA]">
      <div className="container mx-auto">
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

        {/* Grupo Grátis */}
        <div className="mb-12">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-primary/30"></span>
            Grátis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {freeItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-primary/10 transition-all duration-300"
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

        {/* Grupo No seu plano pago */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-zinc-200"></span>
            No seu plano pago
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {planItems.map((item, index) => (
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
      </div>
    </section>
  );
};

export default Features;