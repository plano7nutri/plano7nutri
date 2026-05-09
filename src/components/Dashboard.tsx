"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Flame, Activity, Target, UtensilsCrossed, Camera, Loader2, LogOut, Lock, CheckCircle2, ClipboardList, Utensils, X, ShieldAlert, Heart, Droplets, AlertCircle, Clock, Edit3, Zap, ArrowRight, Crown, Timer } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";
import HealthReminder from "./HealthReminder";
import ImpactPhrase from "./ImpactPhrase";
import DashboardLiveCounter from "./DashboardLiveCounter";
import FreeEditForm from "./FreeEditForm";
import DashboardWhatsAppMockup from "./DashboardWhatsAppMockup";
import ComparisonCard from "./ComparisonCard";

const BlurredMenuMock = ({ name }: { name: string }) => (
  <div className="whitespace-pre-wrap text-zinc-800 text-sm leading-relaxed">
    <div className="text-center font-bold mb-6">🥗 CARDÁPIO SEMANAL PERSONALIZADO</div>
    
    <div className="mb-6">
      <div className="font-bold mb-1">SEGUNDA-FEIRA</div>
      <div>🍳 Café da manhã: <span className="blur-[5px] opacity-50 select-none">Omelete (2 ovos) com queijo minas frescal (50g), Pão integral (2 fatias) e Maçã (1 unidade).</span></div>
      <div>🍎 Lanche 10h: <span className="blur-[5px] opacity-50 select-none">Iogurte natural sem açúcar (1 pote) com sementes de chia (1 colher de sopa).</span></div>
      <div>🍽️ Almoço: <span className="blur-[5px] opacity-50 select-none">Arroz integral (4 colheres de sopa), Feijão (1 concha média), Frango grelhado (120g) e Salada de folhas verdes com tomate e pepino (à vontade).</span></div>
      <div>🥤 Lanche 15h: <span className="blur-[5px] opacity-50 select-none">Pera (1 unidade).</span></div>
      <div>🌙 Jantar: <span className="blur-[5px] opacity-50 select-none">Carne moída magra (120g) refogada com legumes (brócolis, cenoura) e Salada verde (à vontade).</span></div>
    </div>
    
    <div className="mb-6">
      <div className="font-bold mb-1">TERÇA-FEIRA</div>
      <div>🍳 Café da manhã: <span className="blur-[5px] opacity-50 select-none">Ovos mexidos (2 ovos) com Pão integral (2 fatias) e Banana (1 unidade).</span></div>
      <div>🍎 Lanche 10h: <span className="blur-[5px] opacity-50 select-none">Queijo minas frescal (80g).</span></div>
      <div>🍽️ Almoço: <span className="blur-[5px] opacity-50 select-none">Arroz integral (4 colheres de sopa), Feijão (1 concha média), Bife magro (120g) e Abobrinha refogada (1 prato de sobremesa).</span></div>
      <div>🥤 Lanche 15h: <span className="blur-[5px] opacity-50 select-none">Laranja (1 unidade).</span></div>
      <div>🌙 Jantar: <span className="blur-[5px] opacity-50 select-none">Frango desfiado (120g) com purê de batata doce (3 colheres de sopa) e Salada de alface e rúcula (à vontade).</span></div>
    </div>

    <div className="mb-6">
      <div className="font-bold mb-1">QUARTA-FEIRA</div>
      <div>🍳 Café da manhã: <span className="blur-[5px] opacity-50 select-none">Iogurte natural sem açúcar (1 pote) com morangos (1 xícara) e aveia (2 colheres de sopa).</span></div>
      <div>🍎 Lanche 10h: <span className="blur-[5px] opacity-50 select-none">Ovos cozidos (2 unidades).</span></div>
      <div>🍽️ Almoço: <span className="blur-[5px] opacity-50 select-none">Arroz integral (4 colheres de sopa), Feijão (1 concha média), Atum em água (120g) e Brócolis cozido no vapor (1 prato de sobremesa).</span></div>
      <div>🥤 Lanche 15h: <span className="blur-[5px] opacity-50 select-none">Maçã (1 unidade).</span></div>
      <div>🌙 Jantar: <span className="blur-[5px] opacity-50 select-none">Omelete (2 ovos) com espinafre e tomate, acompanhado de Salada mista (à vontade).</span></div>
    </div>

    <div className="mb-6">
      <div className="font-bold mb-1">QUINTA-FEIRA</div>
      <div>🍳 Café da manhã: <span className="blur-[5px] opacity-50 select-none">Pão integral (2 fatias) com ovo cozido fatiado (2 ovos), queijo minas frescal (50g) e Mamão (1 fatia média).</span></div>
      <div>🍎 Lanche 10h: <span className="blur-[5px] opacity-50 select-none">Castanhas (30g).</span></div>
      <div>🍽️ Almoço: <span className="blur-[5px] opacity-50 select-none">Arroz integral (4 colheres de sopa), Feijão (1 concha média), Frango ensopado com quiabo (120g) e Salada de couve refogada (1 prato de sobremesa).</span></div>
      <div>🥤 Lanche 15h: <span className="blur-[5px] opacity-50 select-none">Kiwi (2 unidades).</span></div>
      <div>🌙 Jantar: <span className="blur-[5px] opacity-50 select-none">Carne bovina magra em cubos (120g) com purê de abóbora (3 colheres de sopa) e Salada de folhas verdes (à vontade).</span></div>
    </div>

    <div className="mb-6">
      <div className="font-bold mb-1">SEXTA-FEIRA</div>
      <div>🍳 Café da manhã: <span className="blur-[5px] opacity-50 select-none">Tapioca (1 unidade) com queijo minas frescal (50g), ovo mexido (1 ovo) e Pêssego (1 unidade).</span></div>
      <div>🍎 Lanche 10h: <span className="blur-[5px] opacity-50 select-none">Iogurte natural sem açúcar (1 pote).</span></div>
      <div>🍽️ Almoço: <span className="blur-[5px] opacity-50 select-none">Arroz integral (4 colheres de sopa), Feijão (1 concha média), Carne assada magra (120g) e Salada de grão de bico com pepino e tomate (1 prato de sobremesa).</span></div>
      <div>🥤 Lanche 15h: <span className="blur-[5px] opacity-50 select-none">Uvas (1 cacho pequeno).</span></div>
      <div>🌙 Jantar: <span className="blur-[5px] opacity-50 select-none">Frango grelhado (120g) com legumes cozidos no vapor (cenoura, vagem) e Salada de folhas verdes (à vontade).</span></div>
    </div>

    <div className="mb-6">
      <div className="font-bold mb-1">SÁBADO</div>
      <div>🍳 Café da manhã: <span className="blur-[5px] opacity-50 select-none">Omelete (2 ovos) com tomate e orégano, Pão integral (2 fatias) e Melão (1 fatia média).</span></div>
      <div>🍎 Lanche 10h: <span className="blur-[5px] opacity-50 select-none">Maçã (1 unidade).</span></div>
      <div>🍽️ Almoço: <span className="blur-[5px] opacity-50 select-none">Arroz integral (4 colheres de sopa), Feijão (1 concha média), Atum em água (1 lata, drenado) e Salada de beterraba ralada e cenoura (1 prato de sobremesa).</span></div>
      <div>🥤 Lanche 15h: <span className="blur-[5px] opacity-50 select-none">Queijo minas frescal (80g).</span></div>
      <div>🌙 Jantar: <span className="blur-[5px] opacity-50 select-none">Sopa de legumes com carne bovina magra desfiada (1 prato fundo).</span></div>
    </div>

    <div className="mb-6">
      <div className="font-bold mb-1">DOMINGO</div>
      <div>🍳 Café da manhã: <span className="blur-[5px] opacity-50 select-none">Iogurte natural sem açúcar (1 pote) com banana (1 unidade) e aveia (2 colheres de sopa).</span></div>
      <div>🍎 Lanche 10h: <span className="blur-[5px] opacity-50 select-none">Ovos cozidos (2 unidades).</span></div>
      <div>🍽️ Almoço: <span className="blur-[5px] opacity-50 select-none">Arroz integral (4 colheres de sopa), Feijão (1 concha média), Frango assado (120g) e Salada de lentilha com cheiro-verde (1 prato de sobremesa).</span></div>
      <div>🥤 Lanche 15h: <span className="blur-[5px] opacity-50 select-none">Pera (1 unidade).</span></div>
      <div>🌙 Jantar: <span className="blur-[5px] opacity-50 select-none">Carne magra grelhada (120g) com salada caprese (tomate, queijo minas frescal, manjericão).</span></div>
    </div>

    <div className="text-center mt-6">
      <div>A jornada por uma vida mais saudável é um passo de cada vez. Com dedicação e escolhas inteligentes, você alcançará seus objetivos! 💪</div>
    </div>
  </div>
);

const BlurredListMock = ({ name }: { name: string }) => (
  <div className="whitespace-pre-wrap text-zinc-800 text-sm leading-relaxed">
    <div>🛍️ Sua lista de compras personalizada está pronta!</div>
    <div className="italic">_Calculei cada quantidade com base no seu cardápio dos 7 dias._ 💪</div>
    <br/>
    <div className="font-bold">🛒 LISTA DE COMPRAS SEMANAL</div>
    <br/>

    <div className="font-bold">🥩 PROTEÍNAS:</div>
    <div className="blur-[5px] opacity-50 select-none mb-4">
      - Frango — 480 g<br/>
      - Carne Bovina — 480 g<br/>
      - Atum em água — 240 g
    </div>

    <div className="font-bold">🍞 CARBOIDRATOS & GRÃOS:</div>
    <div className="blur-[5px] opacity-50 select-none mb-4">
      - Pão integral — 8 fatias<br/>
      - Arroz integral — 1000 g<br/>
      - Feijão — 500 g<br/>
      - Sementes de chia — 10 g<br/>
      - Aveia — 40 g<br/>
      - Tapioca — 1 unidade<br/>
      - Grão de bico — 500 g<br/>
      - Lentilha — 500 g
    </div>

    <div className="font-bold">🥦 LEGUMES, VERDURAS & FRUTAS:</div>
    <div className="blur-[5px] opacity-50 select-none mb-4">
      - Maçã — 3 unidades<br/>
      - Pera — 2 unidades<br/>
      - Banana — 2 unidades<br/>
      - Laranja — 1 unidade<br/>
      - Morangos — 150 g<br/>
      - Mamão — 1 unidade<br/>
      - Kiwi — 2 unidades<br/>
      - Pêssego — 1 unidade<br/>
      - Uvas — 1 unidade<br/>
      - Melão — 1 unidade<br/>
      - Tomate — 6 unidades<br/>
      - Pepino — 2 unidades<br/>
      - Brócolis — 2 unidades<br/>
      - Cenoura — 4 unidades<br/>
      - Abobrinha — 1 unidade<br/>
      - Batata doce — 1 unidade<br/>
      - Quiabo — 1 unidade<br/>
      - Abóbora — 1 unidade<br/>
      - Vagem — 1 unidade<br/>
      - Beterraba — 1 unidade<br/>
      - Couve-flor — 1 unidade<br/>
      - Aspargos — 1 maço<br/>
      - Batata doce — 2 unidades<br/>
      - Batata — 2 unidades<br/>
      - Mandioca — 1 unidade<br/>
      - Alface — 2 maços<br/>
      - Couve — 1 maço<br/>
      - Espinafre — 1 maço<br/>
      - Rúcula — 1 maço
    </div>

    <div className="font-bold">🥛 LATICÍNIOS & OVOS:</div>
    <div className="blur-[5px] opacity-50 select-none mb-4">
      - Ovos — 18 unidades<br/>
      - Queijo minas frescal — 360 g<br/>
      - Iogurte natural sem açúcar — 4 unidades
    </div>

    <div className="font-bold">🫙 TEMPEROS, ÓLEOS & OUTROS:</div>
    <div className="mb-1">A gosto mas com moderação</div>
    <div className="blur-[5px] opacity-50 select-none mb-6">
      - Azeite de oliva<br/>
      - Sal<br/>
      - Vinagre<br/>
      - Alho — 1 unidade<br/>
      - Cebola — 1 unidade<br/>
      - Pimenta-do-reino<br/>
      - Limão — 1 unidade<br/>
      - Orégano<br/>
      - Manjericão<br/>
      - Cheiro-verde
    </div>

    <div className="text-center mt-6">
      <div className="mb-4">🎉 <strong>{name}</strong> Seu cardápio personalizado está pronto!</div>
      <div className="mb-4">
        💬 Quem cuida da alimentação cuida do futuro.<br/>
        Você já tomou a decisão mais importante — agora é só executar! 🔥<br/>
        Foco total em Alimentação Saudável! 💪
      </div>
    </div>
  </div>
);

interface DashboardProps {
  name: string;
  whatsapp: string;
  age: number;
  sex: string;
  height: number;
  weight: number;
  activityLabel: string;
  goalLabel: string;
  tmb: number;
  get: number;
  metaCalorias: number;
  metaAgua: number;
  proteina: number;
  carbo: number;
  gordura: number;
  restrictions: string;
  preferences: string;
  avatarUrl?: string;
  entregue?: boolean | null;
  cardapio?: string | null;
  lista?: string | null;
  perfil_editado?: boolean;
  createdAt?: string;
  onAvatarUpdate?: () => void;
  onLogout?: () => void;
}

const activityFactors: Record<string, number> = {
  "Sedentário": 1.2,
  "Levemente ativo": 1.375,
  "Moderadamente ativo": 1.55,
  "Muito ativo": 1.725,
  "Extremamente ativo": 1.9,
};

const Dashboard = ({
  name, age, sex, height, weight, activityLabel, goalLabel,
  tmb, get, metaCalorias, metaAgua, proteina, carbo, gordura, whatsapp,
  restrictions, preferences, avatarUrl, entregue, cardapio, lista, perfil_editado, createdAt, onAvatarUpdate, onLogout
}: DashboardProps) => {
  const { setTheme } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | undefined>(avatarUrl);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  
  // Lógica de Expiração da Oferta (24 horas)
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Lógica de Salvar Resultados (48 minutos)
  const [saveTimeLeft, setSaveTimeLeft] = useState(48 * 60);

  useEffect(() => {
    if (!createdAt) return;
    
    const calculateTimeLeft = () => {
      const startTime = new Date(createdAt).getTime();
      const endTime = startTime + (24 * 60 * 60 * 1000); // 24 horas em ms
      const diff = endTime - Date.now();
      
      if (diff <= 0) {
        setTimeLeft(0);
        return;
      }
      
      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSaveTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatSaveTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    if (avatarUrl) setLocalAvatarUrl(avatarUrl);
  }, [avatarUrl]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${whatsapp.replace(/\D/g, '')}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '0'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      const timestampedUrl = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('usuarios_planogratis')
        .update({ avatar_url: publicUrl })
        .eq('whatsapp', whatsapp);

      if (updateError) throw updateError;

      setLocalAvatarUrl(timestampedUrl);
      toast.success("Foto atualizada!");
      if (onAvatarUpdate) onAvatarUpdate();
    } catch (error: any) {
      toast.error("Falha ao subir foto.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileSave = async (newData: any) => {
    try {
      const tmbCalc = newData.sex === "male" 
        ? 10 * newData.weight + 6.25 * newData.height - 5 * newData.age + 5 
        : 10 * newData.weight + 6.25 * newData.height - 5 * newData.age - 161;
      
      const factor = activityFactors[newData.activity] || 1.2;
      const getCalc = Math.round(tmbCalc * factor);
      
      let metaCaloriasCalc = getCalc;
      if (newData.goal.includes("Perder")) metaCaloriasCalc = Math.round(getCalc * 0.8);
      else if (newData.goal.includes("Ganhar")) metaCaloriasCalc = Math.round(getCalc * 1.15);
      
      const metaAguaCalc = Math.round((newData.weight * 35) / 100) * 100;
      
      let protRatio = 0.3, carbRatio = 0.45, fatRatio = 0.25;
      if (metaCaloriasCalc < getCalc) { protRatio = 0.35; carbRatio = 0.35; fatRatio = 0.3; }
      else if (metaCaloriasCalc > getCalc) { protRatio = 0.3; carbRatio = 0.5; fatRatio = 0.2; }
      
      const proteinaCalc = Math.round((metaCaloriasCalc * protRatio) / 4);
      const carboCalc = Math.round((metaCaloriasCalc * carbRatio) / 4);
      const gorduraCalc = Math.round((metaCaloriasCalc * fatRatio) / 9);

      const { error } = await supabase
        .from("usuarios_planogratis")
        .update({
          nome: newData.name,
          idade: newData.age,
          peso: newData.weight,
          altura: newData.height,
          sexo_biologico: newData.sex,
          meta_calorias: metaCaloriasCalc,
          meta_agua: metaAguaCalc,
          tmb: Math.round(tmbCalc),
          get: getCalc,
          proteina_dia: proteinaCalc,
          carbo_dia: carboCalc,
          gordura_dia: gorduraCalc,
          perfil_editado: true
        })
        .eq("whatsapp", whatsapp);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      if (onAvatarUpdate) onAvatarUpdate();
    } catch (err) {
      toast.error("Erro ao atualizar perfil.");
    }
  };

  const scrollToPricing = () => {
    setIsMenuOpen(false);
    setIsListOpen(false);
    setTimeout(() => {
      const element = document.getElementById("planos-pricing");
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 300);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-background text-foreground">
      <div className="w-full max-w-4xl mx-auto">
        
        <div className="flex justify-end mb-4">
          {onLogout && (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-xs font-bold uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          )}
        </div>

        {timeLeft > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Timer className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-black text-orange-700 uppercase tracking-widest">Oferta Especial</p>
                <p className="text-sm font-medium text-orange-800">
                  Sua oferta expira em: <span className="font-black text-lg tabular-nums">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">Aproveite Agora</p>
              <p className="text-xs text-orange-700 font-bold">Preço Promocional</p>
            </div>
          </motion.div>
        )}

        <HealthReminder />
        
        <DashboardLiveCounter />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="lg:col-span-5 bg-white border-2 border-primary/10 rounded-3xl p-8 shadow-lg flex flex-col h-full"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-xl">
                  <AvatarImage src={localAvatarUrl} alt={name} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {name?.substring(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                
                <label className="absolute bottom-1 right-1 p-3 bg-primary text-white rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-5 h-5" />}
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                </label>
              </div>

              <div className="w-full">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2 border border-primary/20">
                  Plano Gratuito
                </div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h2 className="text-2xl font-black text-zinc-900">{name}</h2>
                  {!perfil_editado && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="Editar perfil (Uma única vez)"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}
                </div>
                <p className="text-sm font-bold text-primary/70">Membro Plano 7</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 text-sm border-y-2 border-primary/5 py-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Idade</span>
                  <p className="font-black text-zinc-900 text-lg">{age} anos</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Peso</span>
                  <p className="font-black text-zinc-900 text-lg">{weight} kg</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Altura</span>
                  <p className="font-black text-zinc-900 text-lg">{(height / 100).toFixed(2).replace(".", ",")} m</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Sexo</span>
                  <p className="font-black text-zinc-900 text-lg">{sex === "male" ? "Masculino" : "Feminino"}</p>
                </div>
              </div>

              <div className="w-full text-left space-y-4">
                <div className="p-4 rounded-2xl bg-primary/5 border-2 border-primary/10">
                  <span className="text-[10px] font-black text-primary uppercase block mb-1 tracking-widest">Atividade</span>
                  <p className="text-sm font-black text-zinc-900">{activityLabel}</p>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-100">
                  <span className="text-[10px] font-black text-orange-600 uppercase block mb-1 tracking-widest">Objetivo</span>
                  <p className="text-sm font-black text-zinc-900">{goalLabel}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Restrições</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-700">
                    {restrictions || "Nenhuma restrição informada."}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Preferências</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-700">
                    {preferences || "Nenhuma preferência informada."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <ImpactPhrase goal={goalLabel} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-primary/10 rounded-3xl p-6 shadow-md relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Flame size={80} className="text-primary" />
                </div>
                <h3 className="text-sm font-black text-primary mb-1 flex items-center gap-2 uppercase tracking-widest">
                  <Flame size={18} /> Calorias Diárias
                </h3>
                <p className="text-4xl font-black text-zinc-900 tracking-tighter mb-1">
                  {metaCalorias} <span className="text-sm font-black text-primary/50 uppercase tracking-normal">kcal</span>
                </p>
                <p className="text-[10px] text-primary/60 font-bold uppercase">Energia ideal para o seu objetivo.</p>
              </div>
              <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-md relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Droplets size={80} className="text-blue-500" />
                </div>
                <h3 className="text-sm font-black text-blue-600 mb-1 flex items-center gap-2 uppercase tracking-widest">
                  <Droplets size={18} /> Meta de Água
                </h3>
                <p className="text-4xl font-black text-zinc-900 tracking-tighter mb-1">
                  {metaAgua} <span className="text-sm font-black text-blue-400/50 uppercase tracking-normal">ml</span>
                </p>
                <p className="text-[10px] text-blue-500/60 font-bold uppercase">Hidratação baseada no seu peso.</p>
              </div>
            </div>

            <div className="bg-zinc-50 border-2 border-zinc-100 rounded-3xl p-4 sm:p-6 shadow-md grid grid-cols-2 gap-2 sm:gap-6 relative overflow-hidden">
              <div className="flex flex-col items-center text-center">
                <h4 className="text-[10px] sm:text-[11px] font-black text-primary uppercase tracking-tighter sm:tracking-widest mb-2 flex flex-col items-center gap-1.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Activity size={14} className="text-primary" />
                  </div>
                  Taxa Basal (TMB)
                </h4>
                <div className="flex items-center justify-center gap-1.5">
                  <p className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight blur-[8px] select-none">
                    {tmb}
                  </p>
                  <Lock size={16} className="text-primary shrink-0" />
                  <span className="text-[11px] sm:text-sm font-black text-primary/50 uppercase tracking-normal">kcal</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-primary font-black uppercase leading-tight mt-2">
                  Energia gasta pelo corpo para manter funções vitais.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <h4 className="text-[10px] sm:text-[11px] font-black text-orange-600 uppercase tracking-tighter sm:tracking-widest mb-2 flex flex-col items-center gap-1.5">
                  <div className="p-1.5 bg-orange-500/10 rounded-lg">
                    <Zap size={14} className="text-orange-500" />
                  </div>
                  Gasto Total (GET)
                </h4>
                <div className="flex items-center justify-center gap-1.5">
                  <p className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight blur-[8px] select-none">
                    {get}
                  </p>
                  <Lock size={16} className="text-orange-500 shrink-0" />
                  <span className="text-[11px] sm:text-sm font-black text-orange-500/50 uppercase tracking-normal">kcal</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-orange-600 font-black uppercase leading-tight mt-2">
                  Gasto calórico total diário incluindo suas atividades.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white border-2 border-primary/5 rounded-3xl p-4 sm:p-6 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-black text-primary uppercase tracking-widest">Macronutrientes</h3>
                    <p className="text-[10px] text-primary/60 font-bold uppercase">Distribuição ideal para seu corpo.</p>
                  </div>
                  <div className="h-1 flex-1 bg-primary/5 ml-4 rounded-full hidden sm:block" />
                </div>
                
                {/* Overlay de Urgência para Dados Bloqueados (Apenas nos Macros) */}
                <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-white/90 border-2 border-orange-200 p-4 rounded-2xl shadow-xl max-w-[280px]">
                    <div className="flex items-center justify-center gap-2 text-orange-600 font-black text-sm uppercase mb-2">
                      {saveTimeLeft > 0 ? <Lock size={16} /> : <AlertCircle size={16} />}
                      {saveTimeLeft > 0 
                        ? `Seus resultados ficam salvos por ${formatSaveTime(saveTimeLeft)}`
                        : "Seus resultados expiraram — desbloqueie agora"}
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase leading-tight">
                      {saveTimeLeft > 0 
                        ? "Garanta seu acesso antes que os cálculos sejam resetados."
                        : "Clique no botão abaixo para garantir seu plano personalizado."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 items-stretch">
                  <div className="bg-red-50 rounded-2xl p-2 sm:p-4 text-center border-2 border-red-100 transition-all hover:scale-105 flex flex-col items-center justify-center h-full">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🥩</div>
                    <span className="text-[9px] sm:text-[11px] font-black text-red-600 uppercase block mb-1 tracking-tighter sm:tracking-widest">Proteína</span>
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-base sm:text-2xl font-black text-zinc-900 tracking-tighter blur-[4px] sm:blur-[8px] select-none">{proteina}</p>
                      <div className="flex items-center gap-0.5">
                        <Lock size={14} className="text-red-500 shrink-0" />
                        <span className="text-[10px] sm:text-sm font-black text-red-600/50">g</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-2 sm:p-4 text-center border-2 border-amber-100 transition-all hover:scale-105 flex flex-col items-center justify-center h-full">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🍞</div>
                    <span className="text-[9px] sm:text-[11px] font-black text-amber-700 uppercase block mb-1 tracking-tighter sm:tracking-widest">Carbo</span>
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-base sm:text-2xl font-black text-zinc-900 tracking-tighter blur-[4px] sm:blur-[8px] select-none">{carbo}</p>
                      <div className="flex items-center gap-0.5">
                        <Lock size={14} className="text-amber-600 shrink-0" />
                        <span className="text-[10px] sm:text-sm font-black text-amber-700/50">g</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-2 sm:p-4 text-center border-2 border-orange-100 transition-all hover:scale-105 flex flex-col items-center justify-center h-full">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🥑</div>
                    <span className="text-[9px] sm:text-[11px] font-black text-orange-700 uppercase block mb-1 tracking-tighter sm:tracking-widest">Gordura</span>
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-base sm:text-2xl font-black text-zinc-900 tracking-tighter blur-[4px] sm:blur-[8px] select-none">{gordura}</p>
                      <div className="flex items-center gap-0.5">
                        <Lock size={14} className="text-orange-500 shrink-0" />
                        <span className="text-[10px] sm:text-sm font-black text-orange-700/50">g</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-primary/40 text-center font-black uppercase tracking-widest">Gramas recomendadas por dia.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch justify-center w-full">
                <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DialogTrigger asChild>
                    <button className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 p-6 rounded-3xl text-zinc-800 font-bold hover:bg-zinc-50 transition-all shadow-lg group backdrop-blur-sm w-full">
                      <Utensils className="w-6 h-6 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-center">Ver Cardápio</span>
                      <Lock size={16} className="text-amber-500 shrink-0" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 bg-white border-none rounded-3xl">
                    <DialogHeader className="p-6 pb-0 bg-white sticky top-0 border-b border-zinc-100 z-20">
                      <DialogTitle className="text-xl font-bold flex items-center gap-2 text-zinc-900">
                        <Utensils className="text-emerald-500" /> Meu Cardápio de 7 Dias
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                      <div className="mb-6 space-y-3 text-zinc-800 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                        <p className="font-medium text-lg">Olá <strong>{name}</strong>, meu nome é <strong>Vivi</strong>! 😊</p>
                        <p className="font-medium text-sm text-zinc-600 mb-4 pb-4 border-b border-emerald-200/50">Vou te enviar agora seu cardápio semanal baseado em:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">Objetivo:</span> <strong className="text-emerald-700">{goalLabel}</strong></p>
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">Restrições:</span> <strong className="text-emerald-700 truncate max-w-[150px]">{restrictions || "Nenhuma"}</strong></p>
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">Preferências:</span> <strong className="text-emerald-700 truncate max-w-[150px]">{preferences || "Nenhuma"}</strong></p>
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">Calorias:</span> <strong className="text-emerald-700">{metaCalorias} kcal</strong></p>
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">Água:</span> <strong className="text-emerald-700">{metaAgua} ml</strong></p>
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">TMB:</span> <Lock size={14} className="text-amber-500"/> <span className="text-zinc-400 text-xs">kcal</span></p>
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">GET:</span> <Lock size={14} className="text-amber-500"/> <span className="text-zinc-400 text-xs">kcal</span></p>
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">Proteína:</span> <Lock size={14} className="text-amber-500"/> <span className="text-zinc-400 text-xs">g</span></p>
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">Carboidrato:</span> <Lock size={14} className="text-amber-500"/> <span className="text-zinc-400 text-xs">g</span></p>
                          <p className="flex items-center gap-2 text-sm font-medium">✅ <span className="text-zinc-500">Gordura:</span> <Lock size={14} className="text-amber-500"/> <span className="text-zinc-400 text-xs">g</span></p>
                        </div>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 p-6 mb-8">
                        <BlurredMenuMock name={name} />
                      </div>
                      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-amber-200 w-full text-center">
                         <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                           <Lock size={32} className="text-amber-500" />
                         </div>
                         <h3 className="text-2xl font-black text-zinc-900 mb-2">Cardápio Bloqueado</h3>
                         <p className="text-zinc-600 font-medium mb-6">
                           Sua estrutura já foi montada. Adquira um dos planos Premium para liberar as refeições, alimentos e quantidades exatas calculadas para você.
                         </p>
                         <button 
                           onClick={scrollToPricing}
                           className="w-full bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-glow flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95"
                         >
                           <Crown size={20} />
                           Desbloquear Agora
                         </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 p-6 rounded-3xl text-zinc-800 font-bold hover:bg-zinc-50 transition-all shadow-lg group backdrop-blur-sm h-full w-full">
                      <ClipboardList className="w-6 h-6 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-center">Ver Lista de Compras</span>
                      <Lock size={16} className="text-amber-500 shrink-0" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 bg-white border-none rounded-3xl">
                    <DialogHeader className="p-6 pb-0 bg-white sticky top-0 border-b border-zinc-100 z-20">
                      <DialogTitle className="text-xl font-bold flex items-center gap-2 text-zinc-900">
                        <ClipboardList className="text-emerald-500" /> Lista de Compras
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 p-6 mb-8">
                        <BlurredListMock name={name} />
                      </div>
                      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-amber-200 w-full text-center">
                         <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                           <Lock size={32} className="text-amber-500" />
                         </div>
                         <h3 className="text-2xl font-black text-zinc-900 mb-2">Lista Bloqueada</h3>
                         <p className="text-zinc-600 font-medium mb-6">
                           Economize tempo e dinheiro no mercado. Desbloqueie o plano Premium para ver as quantidades exatas em gramas que você precisa comprar.
                         </p>
                         <button 
                           onClick={scrollToPricing}
                           className="w-full bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-glow flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95"
                         >
                           <Crown size={20} />
                           Desbloquear Agora
                         </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Seções de Próximos Passos, Mockup, Preços e FAQ movidas para fora do grid principal */}
        <div className="mt-16 space-y-16">
          <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[2rem] text-center shadow-md">
            <p className="text-base sm:text-lg font-medium text-zinc-800 leading-relaxed max-w-2xl mx-auto">
              Seus números estão aqui. Alguns ainda bloqueados 🔒 — e não é à toa. <br />
              <strong className="font-black">Quem vê tudo, age. Quem vê pela metade, adia. Você já sabe como a história do "amanhã eu começo" termina.</strong> <br />
              Nos próximos 30 segundos você pode mudar isso: escolha seu plano, desbloqueie tudo e seu cardápio personalizado chega hoje no WhatsApp. <br />
              <strong className="font-black underline decoration-emerald-500/30">Por menos de R$0,65 por dia. Menos que um café. Você muda sua vida de vez.</strong>
            </p>
          </div>

          <div className="pt-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                É assim que chega no seu WhatsApp
              </h2>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden border-2 border-zinc-100 shadow-sm bg-white">
              <DashboardWhatsAppMockup />
            </div>
          </div>

          <ComparisonCard />

          <div id="planos-pricing">
            <PricingSection />
          </div>

          <FAQSection />
        </div>

        <AnimatePresence>
          {isEditing && (
            <FreeEditForm 
              initialData={{ name, age, sex, height, weight, activity: activityLabel, goal: goalLabel }}
              onClose={() => setIsEditing(false)}
              onSave={handleProfileSave}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;