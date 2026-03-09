import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, Calculator, MessageCircle, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Testimonials from "./Testimonials";
import Features from "./Features";
import LiveCounter from "./LiveCounter";

const steps = [
  {
    icon: ClipboardList,
    title: "Preencha seus dados",
    description: "Idade, peso e nível de atividade. Simples e rápido.",
  },
  {
    icon: Calculator,
    title: "Cálculo Metabólico",
    description: "Descobrimos seu TMB e GET com precisão científica.",
  },
  {
    icon: MessageCircle,
    title: "Receba seu Cálculo na Hora",
    description: "Seu TMB, GET e macros calculados com precisão científica direto na tela, em segundos.",
  },
];

interface LandingProps {
  onStart: () => void;
  onLogin: () => void;
}

const Landing = ({ onStart, onLogin }: LandingProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="w-full py-5 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-foreground">
            Plano <span className="text-primary">7</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Já tenho um plano
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Cálculo Grátis
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            <span className="text-gradient-hero">O seu Plano Nutricional Personalizado de 7 Dias,</span>{" "}
            <span className="text-foreground">direto no WhatsApp.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            Descubra seu metabolismo real e receba um cardápio semanal com a lista de compras baseados em alimentos brasileiros acessíveis, sem invenções respeitando suas <strong>restrições</strong>, <strong>preferências</strong> e <strong>objetivo semanal</strong>. Tudo em segundos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold shadow-glow hover:shadow-card-hover transition-all duration-300 whitespace-nowrap"
            >
              Calcular Meu Metabolismo Grátis
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={onLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/5 transition-all duration-300 whitespace-nowrap"
            >
              <UserCheck className="w-5 h-5" />
              Acessar Meu Plano Grátis
            </motion.button>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 w-full max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="glass rounded-2xl p-6 shadow-card text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Prova Social em Tempo Real */}
      <LiveCounter />

      {/* Seção Como Funciona / Benefícios */}
      <Features />

      {/* Prova Social */}
      <Testimonials onStart={onStart} onLogin={onLogin} />
    </div>
  );
};

export default Landing;