"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Flame, Zap, Activity, Target, UtensilsCrossed, Camera, Loader2, Crown, Star, LogOut, Edit3, Clock, Heart, ShieldAlert, Settings, CheckCircle2, Lock, ClipboardList, Utensils, X, Droplets } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PremiumEditForm from "./PremiumEditForm";
import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";
import HealthReminder from "./HealthReminder";
import ImpactPhrase from "./ImpactPhrase";
import { useAuth } from "./AuthProvider";

interface PremiumDashboardProps {
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
  tipo_assinatura?: string | null;
  plano_semanal?: boolean | null;
  ultimo_envio_plano?: string;
  limite_cardapio_unico?: number;
  assinatura_ativa?: boolean;
  cardapio?: string | null;
  lista?: string | null;
  onAvatarUpdate?: () => void;
  onLogout?: () => void;
  onProfileUpdate?: (data: any) => Promise<void>;
  lastUpdateDate?: string;
  isAdminView?: boolean;
}

const ADMIN_EMAIL = "robson_cruz@live.com";

const PremiumDashboard = ({
  name, age, sex, height, weight, activityLabel, goalLabel,
  tmb, get, metaCalorias, metaAgua, proteina, carbo, gordura, whatsapp,
  restrictions, preferences, avatarUrl, tipo_assinatura, plano_semanal, ultimo_envio_plano, limite_cardapio_unico,
  assinatura_ativa, cardapio, lista, onAvatarUpdate, onLogout, onProfileUpdate, lastUpdateDate, isAdminView = false
}: PremiumDashboardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | undefined>(avatarUrl);
  const queryClient = useQueryClient();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  useEffect(() => {
    if (avatarUrl) setLocalAvatarUrl(avatarUrl);
  }, [avatarUrl]);

  const renderFormattedText = (text: string | null | undefined) => {
    if (!text) return null;
    const parts = text.split(/(\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i} className="font-black text-emerald-400">{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  const isSubscriptionInactive = assinatura_ativa === false;
  const isUnicaDelivered = tipo_assinatura === "Unica" && limite_cardapio_unico === 1;
  const isBlocked = isSubscriptionInactive || isUnicaDelivered;

  const canEdit = () => {
    if (user?.email === ADMIN_EMAIL) return true;
    if (isBlocked) return false;
    if (!lastUpdateDate) return true;
    const lastUpdate = new Date(lastUpdateDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 7;
  };

  const daysToWait = () => {
    if (!lastUpdateDate) return 0;
    const lastUpdate = new Date(lastUpdateDate);
    const nextUpdate = new Date(lastUpdate);
    nextUpdate.setDate(nextUpdate.getDate() + 7);
    const diffTime = nextUpdate.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const canRequestPlan = () => {
    if (user?.email === ADMIN_EMAIL) return true;
    if (isBlocked) return false;
    if (tipo_assinatura === "Unica") return limite_cardapio_unico !== 1;
    if (tipo_assinatura === "Mensal" || plano_semanal === true) {
      if (!ultimo_envio_plano) return true;
      const lastRequest = new Date(ultimo_envio_plano);
      const now = new Date();
      const diffTime = now.getTime() - lastRequest.getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      return diffTime >= sevenDaysInMs;
    }
    return true;
  };

  const daysToNextPlan = () => {
    if (!ultimo_envio_plano) return 0;
    const lastRequest = new Date(ultimo_envio_plano);
    const nextRequest = new Date(lastRequest.getTime() + (7 * 24 * 60 * 60 * 1000));
    const diffTime = nextRequest.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (user?.email === ADMIN_EMAIL) {
      toast.success("Acesso admin: Abrindo WhatsApp...");
      return;
    }
    if (isSubscriptionInactive) {
      e.preventDefault();
      toast.error("Seu acesso está inativo. Renove para continuar.");
      return;
    }
    if (isUnicaDelivered) {
      e.preventDefault();
      toast.error("Seu cardápio único já foi entregue.");
      return;
    }
    if (!canRequestPlan()) {
      e.preventDefault();
      toast.error(`Seu novo plano semanal estará disponível em ${daysToNextPlan()} dias.`, {
        icon: <Clock className="w-5 h-5 text-amber-500" />
      });
      return;
    }
    toast.success("Abrindo WhatsApp para solicitar seu plano...");
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isBlocked && user?.email !== ADMIN_EMAIL) {
      toast.error("Acesso restrito.");
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
      const fileName = `${whatsapp.replace(/\D/g, '')}_premium.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true, cacheControl: '0' });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const timestampedUrl = `${publicUrl}?t=${Date.now()}`;
      const { error: updateError } = await supabase.from('clientes_pagos').update({ avatar_url: publicUrl }).eq('whatsapp', whatsapp);
      if (updateError) throw updateError;
      setLocalAvatarUrl(timestampedUrl);
      toast.success("Foto de perfil atualizada!");
      if (onAvatarUpdate) onAvatarUpdate();
    } catch (error: any) {
      toast.error("Erro ao atualizar foto.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = () => {
    if (user?.email === ADMIN_EMAIL) {
      setIsEditing(true);
      return;
    }
    if (isBlocked) {
      const reason = isSubscriptionInactive 
        ? "Assinatura inativa. Renove para editar seu perfil." 
        : "Cardápio único já entregue. Mude para o plano mensal para edições ilimitadas.";
      toast.error(reason);
      return;
    }
    if (!canEdit()) {
      toast.info(`Você poderá atualizar seu perfil novamente em ${daysToWait()} dias.`, {
        icon: <Clock className="w-5 h-5 text-amber-500" />
      });
      return;
    }
    setIsEditing(true);
  };

  const handleProfileSave = async (data: any) => {
    if (onProfileUpdate) {
      await onProfileUpdate(data);
      setIsEditing(false);
    }
  };

  const whatsappUrl = `https://wa.me/5511910183401?text=${encodeURIComponent("*Olá, sou cliente Premium e quero meu planejamento completo da semana*")}`;

  const getButtonText = () => {
    if (isAdminView) return "Solicitar Cardápio (Modo Admin)";
    if (isSubscriptionInactive) return "Acesso Bloqueado";
    if (isUnicaDelivered) return "Cardápio Entregue";
    if (!canRequestPlan()) {
      const days = daysToNextPlan();
      return `Próximo Plano em ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }
    return "Solicitar Cardápio de Elite";
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="w-full max-w-4xl mx-auto">
        
        {isBlocked && !isAdminView && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-3xl bg-red-500/10 border-2 border-red-500/30 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative overflow-hidden"
          >
            <div className="p-3 rounded-full bg-red-500/20 text-red-500">
              <Lock size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-red-500 font-black uppercase tracking-widest text-xs">Acesso Restrito</h3>
              <p className="text-sm sm:text-base font-medium text-foreground leading-tight">
                {isSubscriptionInactive 
                  ? (tipo_assinatura === "Mensal" 
                      ? "Sua assinatura mensal está inativa. Renove agora para continuar recebendo seus planos semanais."
                      : "Seu acesso está inativo. Renove seu plano para continuar recebendo seus planejamentos.")
                  : "Seu cardápio único já foi entregue com sucesso. Confira as opções abaixo para continuar evoluindo com novos planos."}
              </p>
            </div>
          </motion.div>
        )}

        {!isBlocked && <HealthReminder isPremium={true} />}

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold tracking-widest uppercase text-xs">
                <Crown className="w-4 h-4" />
                Membro Premium
              </div>
              {tipo_assinatura && (
                <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  {tipo_assinatura === "Mensal" ? "Plano Mensal" : "Cardápio Único"}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {user?.email === ADMIN_EMAIL && !isAdminView && (
                <button 
                  onClick={() => navigate('/cadastroadmin')}
                  className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  <Settings className="w-4 h-4" />
                  Painel Admin
                </button>
              )}
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isBlocked ? 'bg-muted' : canEdit() ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                {isBlocked ? <Lock className="w-5 h-5 text-muted-foreground" /> : canEdit() ? <Edit3 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-400" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Controle de Atualização</h4>
                <p className="text-xs text-muted-foreground">
                  {isBlocked 
                    ? "Atualização bloqueada. Assinatura Inativa."
                    : canEdit() 
                      ? "Seu perfil está liberado para nova atualização." 
                      : `Próxima edição disponível em ${daysToWait()} ${daysToWait() === 1 ? 'dia' : 'dias'}.`}
                </p>
              </div>
            </div>
            <button 
              onClick={handleEditClick}
              disabled={(!canEdit() || isBlocked) && !isAdminView}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                isAdminView || (!isBlocked && canEdit()) 
                  ? "bg-primary text-white hover:bg-primary/90 shadow-glow" 
                  : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Editar Perfil
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-900/20 to-card border border-emerald-500/20 p-10 shadow-2xl mb-12 backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Star className="w-32 h-32 text-amber-400 rotate-12" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-emerald-400 rounded-full blur opacity-30 animate-pulse" />
              <Avatar className="w-36 h-36 border-2 border-emerald-500/30 shadow-2xl">
                <AvatarImage src={localAvatarUrl} className="object-cover" />
                <AvatarFallback className="bg-muted text-emerald-400 text-3xl font-bold">
                  {name ? name.substring(0, 2).toUpperCase() : "??"}
                </AvatarFallback>
              </Avatar>
              <label className={`absolute bottom-1 right-1 p-3 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110 ${isBlocked && !isAdminView ? 'bg-muted text-muted-foreground' : 'bg-amber-500 text-white hover:bg-amber-400'}`}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-5 h-5" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isBlocked && !isAdminView} />
              </label>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div>
                <h2 className="text-4xl font-black text-foreground mb-1 tracking-tight">{name || "Usuário"}</h2>
                <p className="text-emerald-400/80 font-bold uppercase tracking-widest text-xs">Membro Elite • Plano {tipo_assinatura}</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm pt-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] font-bold tracking-tighter uppercase">Sexo</span>
                  <span className="font-bold text-foreground">{sex === "male" ? "Masculino" : "Feminino"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Idade</span>
                  <span className="font-bold text-foreground">{age || 0} anos</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Altura</span>
                  <span className="font-bold text-foreground">{(height ? height/100 : 0).toFixed(2)}m</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Peso</span>
                  <span className="font-bold text-foreground">{weight || 0}kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-emerald-500/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 bg-card/50 p-5 rounded-2xl border border-emerald-500/5 transition-all hover:bg-card">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Rotina Ativa</p>
                  <p className="text-base font-bold text-foreground">{activityLabel || "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-card/50 p-5 rounded-2xl border border-emerald-500/5 transition-all hover:bg-card">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                  <Target size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Foco Semanal</p>
                  <p className="text-base font-bold text-foreground">{goalLabel || "Não informado"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Restrições Elite</span>
                </div>
                <p className="text-sm font-medium text-foreground bg-muted/30 p-5 rounded-2xl border border-emerald-500/5 min-h-[100px]">
                  {restrictions || "Nenhuma restrição informada."}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Heart className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Preferências Elite</span>
                </div>
                <p className="text-sm font-medium text-foreground bg-muted/30 p-5 rounded-2xl border border-emerald-500/5 min-h-[100px]">
                  {preferences || "Nenhuma preferência informada."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 px-6 py-3 rounded-[1.5rem] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-500/30 shadow-glow relative group"
          >
            <div className="absolute -inset-1 bg-amber-500/20 blur opacity-30 group-hover:opacity-50 transition-opacity" />
            <span className="text-2xl drop-shadow-sm">💎</span>
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 uppercase tracking-tighter text-center">
              Seu Planejamento Nutricional
            </h2>
            <span className="text-2xl drop-shadow-sm">✨</span>
          </motion.div>
        </div>

        <ImpactPhrase goal={goalLabel} />

        {/* Metabolismo de Base (TMB e GET) - PREMIUM */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card/40 border border-emerald-500/10 p-5 rounded-3xl backdrop-blur-sm">
            <h4 className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Activity size={12} />
              Metabolismo Basal (TMB)
            </h4>
            <p className="text-2xl font-black text-foreground tracking-tighter">
              {tmb} <span className="text-xs font-bold text-muted-foreground uppercase tracking-normal">kcal</span>
            </p>
          </div>
          <div className="bg-card/40 border border-emerald-500/10 p-5 rounded-3xl backdrop-blur-sm">
            <h4 className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Zap size={12} />
              Gasto Total (GET)
            </h4>
            <p className="text-2xl font-black text-foreground tracking-tighter">
              {get} <span className="text-xs font-bold text-muted-foreground uppercase tracking-normal">kcal</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-emerald-500/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl"><Flame className="w-6 h-6 text-emerald-400" /></div>
              <h3 className="text-xl font-bold text-foreground">Energia & Hidratação</h3>
            </div>
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Meta de Queima</p>
                  <p className="text-4xl font-black text-emerald-400 tracking-tighter">{(metaCalorias || 0).toLocaleString()} <span className="text-base font-bold text-muted-foreground uppercase tracking-normal">kcal</span></p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Água</p>
                  <p className="text-3xl font-black text-blue-400 tracking-tighter">{metaAgua || 0} <span className="text-base font-bold text-muted-foreground uppercase tracking-normal">ml</span></p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-emerald-500/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-amber-500/10 rounded-xl"><Zap className="w-6 h-6 text-amber-400" /></div>
              <h3 className="text-xl font-bold text-foreground">Macro Distribuição</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-5 rounded-2xl bg-muted/50 border border-emerald-500/5 transition-colors hover:bg-muted">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3">Proteína</p>
                <p className="text-3xl font-black text-foreground tracking-tighter">{proteina || 0}g</p>
              </div>
              <div className="text-center p-5 rounded-2xl bg-muted/50 border border-emerald-500/5 transition-colors hover:bg-muted">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3">Carbo</p>
                <p className="text-3xl font-black text-foreground tracking-tighter">{carbo || 0}g</p>
              </div>
              <div className="text-center p-5 rounded-2xl bg-muted/50 border border-emerald-500/5 transition-colors hover:bg-muted">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3">Gordura</p>
                <p className="text-3xl font-black text-foreground tracking-tighter">{gordura || 0}g</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cardapio && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-3 bg-card border-2 border-emerald-500/20 p-6 rounded-3xl text-emerald-400 font-bold hover:bg-emerald-500/5 transition-all shadow-lg group backdrop-blur-sm">
                  <Utensils className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Ver Cardápio Elite
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-0 border-none bg-background">
                <div className="sticky top-0 bg-background border-b border-emerald-500/10 p-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3 text-emerald-400 font-bold text-xl">
                    <Utensils className="w-6 h-6" />
                    Cardápio Personalizado
                  </div>
                </div>
                <div className="p-8">
                  <div className="whitespace-pre-wrap text-base text-foreground leading-relaxed font-medium bg-muted/50 p-8 rounded-2xl border border-border shadow-inner">
                    {renderFormattedText(cardapio)}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {lista && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-3 bg-card border-2 border-emerald-500/20 p-6 rounded-3xl text-emerald-400 font-bold hover:bg-emerald-500/5 transition-all shadow-lg group backdrop-blur-sm">
                  <ClipboardList className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Ver Lista de Compras
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-0 border-none bg-background">
                <div className="sticky top-0 bg-background border-b border-emerald-500/10 p-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3 text-emerald-400 font-bold text-xl">
                    <ClipboardList className="w-6 h-6" />
                    Lista de Compras
                  </div>
                </div>
                <div className="p-8">
                  <div className="whitespace-pre-wrap text-base text-foreground leading-relaxed font-medium bg-muted/50 p-8 rounded-2xl border border-border shadow-inner">
                    {renderFormattedText(lista)}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          whileHover={canRequestPlan() || isAdminView ? { scale: 1.02, y: -2 } : {}}
          whileTap={canRequestPlan() || isAdminView ? { scale: 0.98 } : {}}
          className={`block w-full md:max-w-md md:mx-auto relative group transition-all duration-300 mt-12 ${( (!canRequestPlan() || isBlocked) && !isAdminView) ? 'opacity-80' : ''}`}
        >
          <div className={`absolute -inset-1 rounded-[2rem] blur opacity-25 transition duration-1000 ${ (canRequestPlan() && !isBlocked) || isAdminView ? 'bg-[#25D366]/50 group-hover:opacity-50 group-hover:duration-200' : 'bg-zinc-500'}`} />
          <div className={`relative rounded-[2rem] p-5 shadow-2xl flex flex-col items-center text-center gap-3 overflow-hidden ${ (canRequestPlan() && !isBlocked) || isAdminView ? 'bg-[#25D366] text-white' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
            <div className="flex items-center gap-3">
              { (canRequestPlan() && !isBlocked) || isAdminView ? <MessageCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-[#25D366]" />}
              <h3 className="text-lg font-black uppercase tracking-tight">
                {getButtonText()}
              </h3>
            </div>
          </div>
        </motion.a>

        {(isBlocked && !isAdminView) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 pt-16 border-t border-emerald-500/10"
          >
            <PricingSection isDark={true} />
          </motion.div>
        )}

        <FAQSection isDark={true} />

        <AnimatePresence>
          {isEditing && (
            <PremiumEditForm 
              initialData={{ name, age, sex, height, weight, activity: activityLabel, goal: goalLabel, restrictions, preferences }}
              onClose={() => setIsEditing(false)}
              onSave={handleProfileSave}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PremiumDashboard;