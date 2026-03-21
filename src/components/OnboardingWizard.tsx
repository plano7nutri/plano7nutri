import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, UserCheck, Plus, Minus, CheckCircle2, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatWhatsApp } from "@/lib/utils";

export interface OnboardingData {
  id?: string;
  name: string;
  whatsapp: string;
  whatsapp_confirmacao: string;
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
  const [isChecking, setIsChecking] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'not_found' | 'exists' | 'pending'>('idle');
  const [whatsappError, setWhatsappError] = useState("");
  const [confirmWhatsapp, setConfirmWhatsapp] = useState("");
  const [heightInput, setHeightInput] = useState("1,70");
  const [data, setData] = useState<OnboardingData>({
    name: "", 
    whatsapp: "", 
    whatsapp_confirmacao: "",
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

  const checkWhatsAppStatus = async () => {
    setIsChecking(true);
    setValidationStatus('idle');
    setWhatsappError("");
    
    try {
      const cleanWhatsapp = formatWhatsApp(data.whatsapp);
      
      const { data: user, error } = await supabase
        .from("usuarios_planogratis")
        .select("id, nome")
        .eq("whatsapp", cleanWhatsapp)
        .maybeSingle();

      if (error) throw error;

      if (!user) {
        setValidationStatus('not_found');
        return false;
      }

      if (user.nome && user.nome.trim() !== "") {
        setValidationStatus('exists');
        return false;
      }

      // Encontrou e o nome está vazio -> Pode prosseguir
      setData(prev => ({ ...prev, id: user.id }));
      setValidationStatus('pending');
      return true;
    } catch (err) {
      console.error("Erro ao validar WhatsApp:", err);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const validateWhatsappLength = (val: string) => {
    const clean = val.replace(/\D/g, "");
    return clean.length === 10 || clean.length === 11;
  };

  const next = async () => {
    if (step === 0) {
      const cleanWhatsapp = data.whatsapp.replace(/\D/g, "");
      const cleanConfirm = confirmWhatsapp.replace(/\D/g, "");

      if (!validateWhatsappLength(cleanWhatsapp)) {
        setWhatsappError("O WhatsApp deve ter 10 ou 11 dígitos (DDD + Número).");
        return;
      }
      if (cleanWhatsapp !== cleanConfirm) {
        setWhatsappError("Os números de WhatsApp não coincidem.");
        return;
      }
      
      const canGo = await checkWhatsAppStatus();
      if (!canGo) return;
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
    if (step === 0) {
      const cleanWhatsapp = data.whatsapp.replace(/\D/g, "");
      const cleanConfirm = confirmWhatsapp.replace(/\D/g, "");
      return (
        data.name.trim() !== "" && 
        validateWhatsappLength(cleanWhatsapp) && 
        validateWhatsappLength(cleanConfirm) &&
        cleanWhatsapp === cleanConfirm &&
        !isChecking
      );
    }
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
      whatsapp: data.whatsapp,
      whatsapp_confirmacao: confirmWhatsapp,
      restrictions: data.restrictions.trim() === "" ? "Nenhuma" : data.restrictions,
      preferences: data.preferences.trim() === "" ? "Nenhuma" : data.preferences,
    });
  };

  const handleGoToWhatsApp = () => {
    const message = encodeURIComponent("Quero calcular meu metabolismo, grátis. Vim do seu site!");
    window.open(`https://wa.me/5511933735838?text=${message}`, "_blank");
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
                As informações não poderão ser editadas, preencha com cuidado.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
                  <input type="text" placeholder="Seu nome" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">WhatsApp com DDD (Apenas números)</label>
                    <input
                      type="tel"
                      maxLength={11}
                      value={data.whatsapp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setData({ ...data, whatsapp: val });
                        setValidationStatus('idle');
                        setWhatsappError("");
                      }}
                      className={`w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium focus:outline-none focus:ring-2 ${
                        validationStatus !== 'idle' && validationStatus !== 'pending' || whatsappError ? "border-destructive focus:ring-destructive" : "focus:ring-ring"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirme seu WhatsApp</label>
                    <input
                      type="tel"
                      maxLength={11}
                      value={confirmWhatsapp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setConfirmWhatsapp(val);
                        setWhatsappError("");
                      }}
                      className={`w-full px-4 py-3 rounded-xl border bg-card text-foreground text-lg font-medium focus:outline-none focus:ring-2 ${
                        (confirmWhatsapp !== "" && data.whatsapp !== confirmWhatsapp) || whatsappError ? "border-destructive focus:ring-destructive" : "focus:ring-ring"
                      }`}
                    />
                  </div>
                  
                  {whatsappError && (
                    <p className="mt-2 text-xs font-bold text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {whatsappError}
                    </p>
                  )}

                  {validationStatus === 'not_found' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                      <div className="flex items-start gap-2 text-destructive mb-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-bold leading-tight">WhatsApp inválido, por favor digite seu WhatsApp.</p>
                      </div>
                      <button onClick={handleGoToWhatsApp} className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                        <MessageCircle className="w-4 h-4" /> Calcular Meu Metabolismo Grátis
                      </button>
                    </motion.div>
                  )}

                  {validationStatus === 'exists' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-start gap-2 text-amber-700 mb-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-bold leading-tight">Este usuário já existe.</p>
                      </div>
                      {onGoToLogin && (
                        <button onClick={onGoToLogin} className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                          <UserCheck className="w-4 h-4" /> Acessar Meu Plano
                        </button>
                      )}
                    </motion.div>
                  )}

                  {validationStatus === 'pending' && (
                    <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> WhatsApp validado. Continue seu cadastro.
                    </p>
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
              <h2 className="text-2xl font-bold text-foreground mb-6">Preferências e Restrições</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Restrições Alimentares</label>
                  <textarea 
                    placeholder="Ex: Não como carne, sou intolerante a lactose, não gosto de coentro, evito açúcar..." 
                    value={data.restrictions} 
                    onChange={(e) => setData({ ...data, restrictions: e.target.value })} 
                    className="w-full p-4 rounded-xl border bg-card min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Preferências Alimentares</label>
                  <textarea 
                    placeholder="Ex: Gosto muito de ovos, prefiro arroz integral, amo frutas, gosto de café da manhã reforçado..." 
                    value={data.preferences} 
                    onChange={(e) => setData({ ...data, preferences: e.target.value })} 
                    className="w-full p-4 rounded-xl border bg-card min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-10">
          <button onClick={prev} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /> Voltar</button>
          {!isLastStep ? (
            <button disabled={!canProceed()} onClick={next} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold disabled:opacity-40">{isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Próximo <ArrowRight className="w-4 h-4" /></>}</button>
          ) : (
            <button disabled={!canProceed() || loading} onClick={handleFinish} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold disabled:opacity-40">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Quero meu Plano!"}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;