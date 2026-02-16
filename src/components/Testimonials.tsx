import { Star, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Marina S.",
    initials: "MS",
    color: "bg-pink-100 text-pink-600",
    text: "Fiz o cadastro em menos de 2 minutos e o plano chegou no Zap na hora. Muito mais rápido do que eu imaginava!",
    time: "há 2 dias",
    useful: 14,
  },
  {
    name: "Roberto L.",
    initials: "RL",
    color: "bg-blue-100 text-blue-600",
    text: "Seguindo o plano há 5 dias e já sinto a diferença no meu rendimento. O cálculo das calorias foi certeiro para o meu objetivo.",
    time: "há 3 dias",
    useful: 22,
  },
  {
    name: "Carla M.",
    initials: "CM",
    color: "bg-emerald-100 text-emerald-600",
    text: "Finalmente um planejamento que fala a nossa língua! Arroz, feijão e ovo, sem precisar comprar ingredientes caros ou difíceis.",
    time: "há 1 semana",
    useful: 31,
  },
  {
    name: "Ricardo F.",
    initials: "RF",
    color: "bg-orange-100 text-orange-600",
    text: "Receber tudo no WhatsApp facilitou demais minha vida. Não preciso baixar app nenhum, está sempre ali na mão.",
    time: "há 5 dias",
    useful: 18,
  },
  {
    name: "Juliana P.",
    initials: "JP",
    color: "bg-purple-100 text-purple-600",
    text: "O cálculo do GET real abriu meus olhos. O cardápio é super equilibrado e me ajudou a parar de beliscar o dia todo.",
    time: "há 1 dia",
    useful: 27,
  },
  {
    name: "Felipe G.",
    initials: "FG",
    color: "bg-yellow-100 text-yellow-600",
    text: "A lista de compras automática é um salva-vidas! Economizei um tempão no mercado e não comprei nada que não devia.",
    time: "há 1 semana",
    useful: 42,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-zinc-50/50">
      <div className="container mx-auto px-6">
        {/* Header da Seção */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-6 border border-emerald-100">
            <Star className="w-3 h-3 fill-current" />
            Avaliado por 1.482 usuários
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
            O que dizem quem já recebeu
          </h2>

          <div className="flex flex-col items-center gap-1">
            <span className="text-5xl font-black text-foreground">4.9</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium mt-1">de 5 estrelas</span>
          </div>
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col relative"
            >
              <div className="absolute top-6 right-6 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                ✓ Verificado
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-foreground">{t.name}</h4>
                    <span className="text-sm">🇧🇷</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">{t.time}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed mb-6 flex-1">
                "{t.text}"
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold w-fit">
                <ThumbsUp className="w-3 h-3" />
                Útil ({t.useful})
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;