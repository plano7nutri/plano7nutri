import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, UserCheck, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatWhatsApp } from "@/lib/utils";

export interface OnboardingData {
  name: string;
  whatsapp: string;
  age: number;
  sex: "male" | "female" | "";
  height: number;
  weight: number;
  activity: string;
  goal: string;
  restrictions: string;
  preferences: string;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
  onGoToLogin?: () => void;
  hideLoginLink?: boolean;
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

const OnboardingWizard = ({ onComplete, onBack, onGoToLogin, hideLoginLink = false }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateFound, setDuplicateFound] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");
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

  const isLastStep = step === TOTAL_STEPS - 1;

  const validateWhatsapp = (val: string) => {
    const formatted = formatWhatsApp(val);
    if (formatted.length === 0) return "";
    if (formatted.length !== 12 && formatted.length !== 13) {
      return "Número inválido. Digite com DDD: 11987654321 ou 1187654321";
    }
    return "";
  };

  const saveInitialLead = async () => {
    try {
      const cleanWhatsapp = formatWhatsApp(data.whatsapp);
      await supabase
        .from("usuarios_planogratis_registro_inicial")
        .insert([{
          nome: data.name.trim(),
          whatsapp: cleanWhatsapp,
          cliente_gratis: true,
          primeiro_contato: true
        }]);
    } catch (err) {
      console.error("Erro ao salvar registro inicial:", err);
    }
  };

  const checkDuplicate = async () => {
    if (hideLoginLink) return false; 
    
    setIsCheckingDuplicate(true);
    setDuplicateFound(false);
    try {
      const cleanWhatsapp = formatWhatsApp(data.whatsapp);
      const { data: existingUser } = await supabase
        .from("usuarios_planogratis")
        .select("id")
        .eq("whatsapp", cleanWhatsapp)
        .maybeSingle();

      if (existingUser) {
        setDuplicateFound(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro ao verificar duplicidade:", err);
      return false;
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  const next = async () => {
    if (step === 0) {
      const error = validateWhatsapp(data.whatsapp);
      if (error) {
        setWhatsappError(error);
        return;
      }
      const isDuplicate = await checkDuplicate();
      if (isDuplicate) return;
      await saveInitialLead();
    }
    setDir(1); 
    setStep((s) => s + 1);
  };

  const prev = () => {
    if (step === 0) { onBack(); return; }
    setDir(-1); setStep((s) => s - 1);
  };

  const handleHeightChange = (val: string) => {
    let formatted = val.replace(/[^0-9,]/g, "");
    if (!formatted.includes(",")) {
      if (formatted.length > 1) {
        formatted = formatted.charAt(0) + "," + formatted.slice(1);
      }
    }
    setHeightInput(formatted);
    const numericString = formatted.replace(",", ".");
    const numericVal = parseFloat(numericString);
    if (!isNaN(numericVal)) {
      if (numericVal <= 3) {
        setData(prev => ({ ...prev, height: Math.round(numericVal * 100) }));
      } else {
        setData(prev => ({ ...prev, height: Math.round(numericVal) }));
      }
    }
  };

  const stepHeight = (increment: number) => {
    const nextHeight = Math.max(50, Math.min(250, data.height + increment));
    setData(prev => ({ ...prev, height: nextHeight }));
    setHeightInput((nextHeight / 100).toFixed(2).replace(".", ","));
  };

  const stepWeight = (increment: number) => {
    setData(prev => ({ ...prev, weight: Math.max(20, Math.min(300, prev.weight + increment)) }));
  };

  const canProceed = () => {
    if (step === 0) return data.name.trim() !== "" && data.whatsapp.trim().length >= 8 && !isCheckingDuplicate;
    if (step === 1) return data.age > 0 && data.sex !== "" && data.height > 50 && data.weight > 20;
    if (step === 2) return data.activity !== "";
    if (step === 3) return data.goal !== "";
    if (step === 4) return true;
    return false;
  };

  const handleFinish = () => {
    setLoading(true);
    onComplete({
      ...data,
      whatsapp: formatWhatsApp(data.whatsapp)
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <img src="/logo-plano7.png" alt="Plano 7 Logo" className="h-24 w-auto object-contain" />
        </div>

        <div className="flex items-center gap-2 mb-10">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <motion.div key="step0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Vamos começar!</h2>
              <p className="text-muted-foreground mb-1">Informe seu nome e WhatsApp para receber seu plano.</p>
              <p className="text-destructive text-sm font-semibold mb-8 uppercase">
                {hideLoginLink ? "AS INFORMAÇÕES SÓ PODERÃO SER EDITADAS APÓS 7 DIAS PREENCHA COM CUIDADO" : "As informações não poderão ser editadas, preencha com cuidado."}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
                  <input type="text" placeholder="Seu nome" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="11 99999-9999"
                    value={data.whatsapp}
                    onChange={(e) => {
                      setData({ ...data, whatsapp: e.target.value });
                      setDuplicateFound(false);
                      setWhatsappError("");
                    }}
                    className={`w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium focus:outline-none focus:ring-2 ${
                      duplicateFound || whatsappError ? "border-destructive focus:ring-destructive" : "focus:ring-ring"
                    }`}
                  />
                  
                  {whatsappError && (
                    <p className="mt-2 text-xs font-bold text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {whatsappError}
                    </p>
                  )}

                  {duplicateFound && !hideLoginLink && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                      <div className="flex items-start gap-2 text-destructive mb-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-bold leading-tight">Este WhatsApp já possui um plano cadastrado.</p>
                      </div>
                      {onGoToLogin && (
                        <button onClick={onGoToLogin} className="w-full flex items-center justify-center gap-2 bg-destructive text-white py-2.5 rounded-lg text-sm font-bold hover:bg-destructive/90 transition-colors">
                          <UserCheck className="w-4 h-4" /> Acessar meu plano existente
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Seus dados</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Idade</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setData(prev => ({...prev, age: Math.max(1, prev.age - 1)}))} className="p-3 bg-secondary rounded-xl"><Minus className="w-4 h-4 text-primary" /></button>
                    <input type="number" value={data.age} onChange={(e) => setData({ ...data, age: Number(e.target.value) })} className="w-full px-2 py-3 rounded-xl border bg-card text-center text-lg font-bold" />
                    <button onClick={() => setData(prev => ({...prev, age: Math.min(120, prev.age + 1)}))} className="p-3 bg-secondary rounded-xl"><Plus className="w-4 h-4 text-primary" /></button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Altura (m)</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => stepHeight(-1)} className="p-3 bg-secondary rounded-xl"><Minus className="w-4 h-4 text-primary" /></button>
                    <input type="text" value={heightInput} onChange={(e) => handleHeightChange(e.target.value)} className="w-full px-2 py-3 rounded-xl border bg-card text-center text-lg font-bold" />
                    <button onClick={() => stepHeight(1)} className="p-3 bg-secondary rounded-xl"><Plus className="w-4 h-4 text-primary" /></button>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Peso (kg)</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => stepWeight(-1)} className="p-3 bg-secondary rounded-xl"><Minus className="w-4 h-4 text-primary" /></button>
                  <input type="number" value={data.weight} onChange={(e) => setData({ ...data, weight: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border bg-card text-center text-lg font-bold" />
                  <button onClick={() => stepWeight(1)} className="p-3 bg-secondary rounded-xl"><Plus className="w-4 h-4 text-primary" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{ id: "male", label: "Masculino" }, { id: "female", label: "Feminino" }].map((opt) => (
                  <button key={opt.id} onClick={() => setData({ ...data, sex: opt.id as "male" | "female" })} className={`p-4 rounded-xl border-2 font-semibold ${data.sex === opt.id ? "border-primary bg-secondary shadow-glow" : "border-border bg-card"}`}>{opt.label}</button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Atividade</h2>
              <div className="flex flex-col gap-3">
                {activityLevels.map((l) => (
                  <button key={l.id} onClick={() => setData({ ...data, activity: l.id })} className={`p-4 rounded-xl border-2 text-left ${data.activity === l.id ? "border-primary bg-secondary shadow-glow" : "border-border bg-card"}`}>
                    <div className="font-semibold">{l.label}</div>
                    <div className="text-sm text-muted-foreground">{l.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Objetivo</h2>
              <div className="flex flex-col gap-3">
                {goals.map((g) => (
                  <button key={g.id} onClick={() => setData({ ...data, goal: g.id })} className={`p-4 rounded-xl border-2 text-left ${data.goal === g.id ? "border-primary bg-secondary shadow-glow" : "border-border bg-card"}`}>
                    <div className="font-semibold">{g.label}</div>
                    <div className="text-sm text-muted-foreground">{g.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Preferências</h2>
              <textarea placeholder="Restrições..." value={data.restrictions} onChange={(e) => setData({ ...data, restrictions: e.target.value })} className="w-full p-4 rounded-xl border bg-card mb-4 min-h-[100px] resize-none" />
              <textarea placeholder="Preferências..." value={data.preferences} onChange={(e) => setData({ ...data, preferences: e.target.value })} className="w-full p-4 rounded-xl border bg-card min-h-[100px] resize-none" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-10">
          <button onClick={prev} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /> Voltar</button>
          {!isLastStep ? (
            <button disabled={!canProceed()} onClick={next} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold disabled:opacity-40">{isCheckingDuplicate ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Próximo <ArrowRight className="w-4 h-4" /></>}</button>
          ) : (
            <button disabled={!canProceed() || loading} onClick={handleFinish} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold disabled:opacity-40">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Quero meu Plano!"}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;