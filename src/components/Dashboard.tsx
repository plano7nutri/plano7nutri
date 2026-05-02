"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Flame, Activity, Target, UtensilsCrossed, Camera, Loader2, LogOut, Lock, CheckCircle2, ClipboardList, Utensils, X, ShieldAlert, Heart, Droplets, AlertCircle, Clock, Edit3 } from "lucide-react";
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
  
  // Lógica de Expiração de 24 horas
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!createdAt) return;
    
    const calculateTimeLeft = () => {
      const startTime = new Date(createdAt).getTime();
      const endTime = startTime + (24 * 60 * 60 * 1000); // 24 horas em ms
      const diff = endTime - Date.now();
      
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft(0);
        return;
      }
      
      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    if (avatarUrl) setLocalAvatarUrl(avatarUrl);
  }, [avatarUrl]);

  const renderFormattedText = (text: string | null | undefined) => {
    if (!text) return null;
    const parts = text.split(/(\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i} className="font-black text-primary">{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isExpired) {
      toast.error("Acesso expirado.");
      return;
    }
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
    if (isExpired) {
      toast.error("Acesso expirado.");
      return;
    }
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

  // Se o tempo expirou, mostra a tela de bloqueio
  if (isExpired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl shadow-lg border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-4">Acesso Expirado</h2>
          <p className="text-zinc-600 mb-2">
            Seu acesso gratuito de 24 horas expirou.
          </p>
          <p className="text-zinc-500 text-sm mb-8">
            Conforme nossos termos, seus dados foram removidos do sistema. Para continuar tendo acesso ao seu planejamento, adquira um de nossos planos premium.
          </p>
          <button 
            onClick={onLogout}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-background text-foreground">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Barra de Expiração */}
        {timeLeft > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Acesso Grátis</p>
                <p className="text-sm font-medium text-amber-800">
                  Seu acesso expira em: <span className="font-black text-lg">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-amber-600 uppercase">Limite</p>
              <p className="text-xs text-amber-700">24 Horas</p>
            </div>
          </motion.div>
        )}

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

        <HealthReminder />
        
        <DashboardLiveCounter />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="lg:col-span-5 bg-white border-2 border-primary/10 rounded-3xl p-8 shadow-lg h-fit"
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
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading || isExpired} />
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

          <div className="lg:col-span-7 space-y-6">
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

            <div className="bg-white border-2 border-primary/5 rounded-3xl p-4 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest">Macronutrientes</h3>
                  <p className="text-[10px] text-primary/60 font-bold uppercase">Distribuição ideal para seu corpo.</p>
                </div>
                <div className="h-1 flex-1 bg-primary/5 ml-4 rounded-full hidden sm:block" />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-red-50 rounded-2xl p-2 sm:p-5 text-center border-2 border-red-100 transition-all hover:scale-105 flex flex-col items-center justify-center">
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
                <div className="bg-amber-50 rounded-2xl p-2 sm:p-5 text-center border-2 border-amber-100 transition-all hover:scale-105 flex flex-col items-center justify-center">
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
                <div className="bg-orange-50 rounded-2xl p-2 sm:p-5 text-center border-2 border-orange-100 transition-all hover:scale-105 flex flex-col items-center justify-center">
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
              <p className="mt-6 text-[10px] text-primary/40 text-center font-black uppercase tracking-widest">Gramas recomendadas por dia.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {cardapio && (
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.button 
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-full bg-gradient-to-r from-primary to-emerald-500 text-white p-6 rounded-[2rem] font-black uppercase tracking-tighter shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(16,185,129,0.5)] hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-3 border-b-4 border-emerald-700"
                    >
                      <Utensils size={24} className="drop-shadow-md" />
                      <span className="text-lg">Ver Cardápio</span>
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Meu Cardápio de 7 Dias</DialogTitle></DialogHeader>
                    <div className="whitespace-pre-wrap text-zinc-700 bg-zinc-50 p-6 rounded-xl border">{renderFormattedText(cardapio)}</div>
                  </DialogContent>
                </Dialog>
              )}
              {lista && (
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.button 
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                      className="w-full bg-gradient-to-r from-primary to-emerald-500 text-white p-6 rounded-[2rem] font-black uppercase tracking-tighter shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(16,185,129,0.5)] hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-3 border-b-4 border-emerald-700"
                    >
                      <ClipboardList size={24} className="drop-shadow-md" />
                      <span className="text-lg">Ver Lista</span>
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Lista de Compras</DialogTitle></DialogHeader>
                    <div className="whitespace-pre-wrap text-zinc-700 bg-zinc-50 p-6 rounded-xl border">{renderFormattedText(lista)}</div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-12 space-y-8">
          <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[2rem] text-center shadow-md">
            <p className="text-base sm:text-lg font-medium text-zinc-800 leading-relaxed max-w-2xl mx-auto">
              Seus números estão aqui. Alguns ainda bloqueados 🔒 — e não é à toa. <br />
              <strong className="font-black">Quem vê tudo, age. Quem vê pela metade, adia. Você já sabe como a história do "amanhã eu começo" termina.</strong> <br />
              Nos próximos 30 segundos você pode mudar isso: escolha seu plano, desbloqueie tudo e seu cardápio personalizado chega hoje no WhatsApp. <br />
              <strong className="font-black underline decoration-emerald-500/30">Por menos de R$0,65 por dia. Menos que um café. Você muda sua vida de vez.</strong>
            </p>
          </div>

          <div className="pt-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                É assim que chega no seu WhatsApp
              </h2>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden border-2 border-zinc-100 shadow-sm bg-white">
              <DashboardWhatsAppMockup />
            </div>
          </div>

          <PricingSection />
        </div>

        <FAQSection />

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