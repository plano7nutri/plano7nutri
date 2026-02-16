import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export interface OnboardingData {
  name: string;
  whatsapp: string;
  age: number;
  sex: "male" | "female" | "";
  height: number; // armazenado em cm internamente
  weight: number;
  activity: string;
  goal: string;
  restrictions: string;
  preferences: string;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
}

const activityLevels = [
  { id: "sedentary", label: "Sedentário", desc: "Pouca ou nenhuma atividade física" },
  { id: "lightly_active", label: "Levemente ativo", desc: "Exercícios leves 1-3 dias/semana" },
  { id: "moderately_active", label: "Moderadamente ativo", desc: "Exercícios moderados 3-5 dias/semana" },
  { id: "very_active", label: "Muito ativo", desc: "Exercícios intensos 6-7 dias/semana" },
  { id: "extremely_active", label: "Extremamente ativo", desc: "Treinos muito intensos, atleta" },
];

const goals = [
  { id: "lose_weight", label: "Perder Peso / Emagrecer", desc: "Déficit calórico controlado" },
  { id: "gain_muscle", label: "Ganhar Massa / Hipertrofia", desc: "Superávit calórico + proteína" },
  { id: "healthy_eating", label: "Alimentação Saudável", desc: "Equilíbrio e qualidade nutricional" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
};

const TOTAL_STEPS = 5;

const OnboardingWizard = ({ onComplete, onBack }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [heightInput, setHeightInput] = useState("1,70");
  const [data, setData] = useState<OnboardingData>({
    name: "", 
    whatsapp: "", 
    age: 25, 
    sex: "", 
    height: 170, 
    weight: 70, 
    activity: "", 
    goal: "",
    restrictions: "",
    preferences: "",
  });

  const next = () => { setDir(1); setStep((s) => s + 1); };
  const prev = () => {
    if (step === 0) { onBack(); return; }
    setDir(-1); setStep((s) => s - 1);
  };

  const handleHeightChange = (val: string) => {
    const formatted = val.replace(/[^0-9,]/g, "");
    setHeightInput(formatted);
    
    const numericVal = parseFloat(formatted.replace(",", "."));
    if (!isNaN(numericVal)) {
      setData({ ...data, height: Math.round(numericVal * 100) });
    }
  };

  const canProceed = () => {
    if (step === 0) return data.name.trim() !== "" && data.whatsapp.trim().length >= 10;
    if (step === 1) {
      const h = data.height / 100;
      return data.age > 0 && data.age <= 100 && data.sex !== "" && h > 0 && h <= 2.50 && data.weight > 0 && data.weight <= 250;
    }
    if (step === 2) return data.activity !== "";
    if (step === 3) return data.goal !== "";
    if (step === 4) return true; // Restrições e preferências são opcionais
    return false;
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => onComplete(data), 1800);
  };

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          {/* Step 0: Name & WhatsApp */}
          {step === 0 && (
            <motion.div key="step0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Vamos começar!</h2>
              <p className="text-muted-foreground mb-8">Informe seu nome e WhatsApp para receber seu plano.</p>

              <label className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring mb-6"
              />

              <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={data.whatsapp}
                onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </motion.div>
          )}

          {/* Step 1: Age, Sex, Height, Weight */}
          {step === 1 && (
            <motion.div key="step1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Seus dados</h2>
              <p className="text-muted-foreground mb-6">Informações para calcular seu metabolismo.</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Idade (máx 100)</label>
                  <input type="number" min={1} max={100} value={data.age} onChange={(e) => setData({ ...data, age: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium text-center focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Altura (m - máx 2,50)</label>
                  <input type="text" placeholder="1,70" value={heightInput} onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium text-center focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Peso (kg - máx 250)</label>
                <input type="number" min={1} max={250} value={data.weight} onChange={(e) => setData({ ...data, weight: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium text-center focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <label className="block text-sm font-medium text-foreground mb-3">Sexo Biológico</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ id: "male", label: "Masculino" }, { id: "female", label: "Feminino" }].map((opt) => (
                  <button key={opt.id} onClick={() => setData({ ...data, sex: opt.id as "male" | "female" })}
                    className={`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
                      data.sex === opt.id ? "border-primary bg-secondary text-secondary-foreground shadow-glow" : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Activity Level */}
          {step === 2 && (
            <motion.div key="step2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Nível de atividade</h2>
              <p className="text-muted-foreground mb-6">Qual sua frequência de exercícios?</p>
              <div className="flex flex-col gap-3">
                {activityLevels.map((level) => (
                  <button key={level.id} onClick={() => setData({ ...data, activity: level.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      data.activity === level.id ? "border-primary bg-secondary shadow-glow" : "border-border bg-card hover:border-primary/40"
                    }`}>
                    <div className="font-semibold text-foreground">{level.label}</div>
                    <div className="text-sm text-muted-foreground">{level.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Goal */}
          {step === 3 && (
            <motion.div key="step3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Seu objetivo</h2>
              <p className="text-muted-foreground mb-6">O que você quer alcançar com o Plano 7?</p>
              <div className="flex flex-col gap-3">
                {goals.map((g) => (
                  <button key={g.id} onClick={() => setData({ ...data, goal: g.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      data.goal === g.id ? "border-primary bg-secondary shadow-glow" : "border-border bg-card hover:border-primary/40"
                    }`}>
                    <div className="font-semibold text-foreground">{g.label}</div>
                    <div className="text-sm text-muted-foreground">{g.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Restrictions & Preferences */}
          {step === 4 && (
            <motion.div key="step4" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Preferências</h2>
              <p className="text-muted-foreground mb-6">Personalize ainda mais o seu cardápio.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Restrições Alimentares</label>
                  <textarea 
                    placeholder="Ex: Intolerância a lactose, alergia a amendoim, não como carne de porco..."
                    value={data.restrictions}
                    onChange={(e) => setData({ ...data, restrictions: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Preferências Alimentares</label>
                  <textarea 
                    placeholder="Ex: Gosto muito de ovos, prefiro frango a carne vermelha, amo frutas..."
                    value={data.preferences}
                    onChange={(e) => setData({ ...data, preferences: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button onClick={prev} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>

          {!isLastStep ? (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!canProceed()} onClick={next}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all">
              Próximo <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!canProceed() || loading} onClick={handleFinish}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all">
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Calculando...</>) : "Quero meu Plano de 7 dias agora!"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;