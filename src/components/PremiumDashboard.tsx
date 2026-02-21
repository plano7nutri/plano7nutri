"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Flame, Zap, Activity, Target, UtensilsCrossed, Camera, Loader2, Crown, Star, LogOut, Edit3, Clock, Heart, ShieldAlert, Settings, CheckCircle2, Lock, ClipboardList, Utensils } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PremiumEditForm from "./PremiumEditForm";
import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";
import HealthReminder from "./HealthReminder";
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
}

const ADMIN_EMAIL = "robson_cruz@live.com";

const PremiumDashboard = ({
  name, age, sex, height, weight, activityLabel, goalLabel,
  tmb, get, metaCalorias, metaAgua, proteina, carbo, gordura, whatsapp,
  restrictions, preferences, avatarUrl, tipo_assinatura, plano_semanal, ultimo_envio_plano, limite_cardapio_unico,
  assinatura_ativa, cardapio, lista, onAvatarUpdate, onLogout, onProfileUpdate, lastUpdateDate
}: PremiumDashboardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | undefined>(avatarUrl);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (avatarUrl) setLocalAvatarUrl(avatarUrl);
  }, [avatarUrl]);

  const renderFormattedText = (text: string | null | undefined) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-black text-emerald-400">{part.slice(2, -2)}</strong>;
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

  return (
    <div className="min-h-screen bg-[#051c14] text-zinc-100 px-6 py-10">
      <div className="w-full max-w-4xl mx-auto">
        
        {isBlocked && user?.email !== ADMIN_EMAIL && (
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
              <p className="text-sm sm:text-base font-medium text-zinc-100 leading-tight">
                {isSubscriptionInactive 
                  ? (tipo_assinatura === "Mensal" 
                      ? "Sua assinatura mensal está inativa. Renove agora para continuar recebendo seus planos semanais."
                      : "Seu acesso está inativo. Renove seu plano para continuar recebendo seus planejamentos.")
                  : "Seu cardápio único já foi entregue com sucesso. Confira as opções abaixo para continuar evoluindo com novos planos."}
              </p>
            </div>
          </motion.div>
        )}

        {(!isBlocked || user?.email === ADMIN_EMAIL) && <HealthReminder isPremium={true} />}

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
              {user?.email === ADMIN_EMAIL && (
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
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-emerald-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${user?.email === ADMIN_EMAIL ? 'bg-amber-500/20 text-amber-400' : isBlocked ? 'bg-zinc-800' : canEdit() ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                {user?.email === ADMIN_EMAIL ? <Settings className="w-5 h-5" /> : isBlocked ? <Lock className="w-5 h-5 text-zinc-500" /> : canEdit() ? <Edit3 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-400" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-100">Controle de Atualização</h4>
                <p className="text-xs text-zinc-400">
                  {user?.email === ADMIN_EMAIL 
                    ? "Modo Administrador: Edição livre liberada."
                    : isBlocked 
                      ? "Atualização bloqueada. Assinatura Inativa."
                      : canEdit() 
                        ? "Seu perfil está liberado para nova atualização." 
                        : `Próxima edição disponível em ${daysToWait()} ${daysToWait() === 1 ? 'dia' : 'dias'}.`}
                </p>
              </div>
            </div>
            <button 
              onClick={handleEditClick}
              disabled={(!canEdit() || isBlocked) && user?.email !== ADMIN_EMAIL}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                user?.email === ADMIN_EMAIL || (!isBlocked && canEdit()) 
                  ? "bg-emerald-50 text-emerald-950 hover:bg-emerald-400 shadow-glow" 
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
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
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-900/40 to-zinc-900/80 border border-emerald-500/20 p-10 shadow-2xl mb-12 backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Star className="w-32 h-32 text-amber-400 rotate-12" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-emerald-400 rounded-full blur opacity-30 animate-pulse" />
              <Avatar className="w-36 h-36 border-2 border-emerald-500/30 shadow-2xl">
                <AvatarImage src={localAvatarUrl} className="object-cover" />
                <AvatarFallback className="bg-emerald-950 text-emerald-400 text-3xl font-bold">
                  {name ? name.substring(0, 2).toUpperCase() : "??"}
                </AvatarFallback>
              </Avatar>
              <label className={`absolute bottom-1 right-1 p-3 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110 ${isBlocked && user?.email !== ADMIN_EMAIL ? 'bg-zinc-700 text-zinc-400' : 'bg-amber-500 text-emerald-950 hover:bg-amber-400'}`}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-5 h-5" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isBlocked && user?.email !== ADMIN_EMAIL} />
              </label>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div>
                <h2 className="text-4xl font-black text-white mb-1 tracking-tight">{name || "Usuário"}</h2>
                <p className="text-emerald-400/80 font-bold uppercase tracking-widest text-xs">Membro Elite • Plano {tipo_assinatura}</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm pt-2">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] font-bold tracking-tighter uppercase">Sexo</span>
                  <span className="font-bold text-zinc-100">{sex === "male" ? "Masculino" : "Feminino"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">Idade</span>
                  <span className="font-bold text-zinc-100">{age || 0} anos</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">Altura</span>
                  <span className="font-bold text-zinc-100">{(height ? height/100 : 0).toFixed(2)}m</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">Peso</span>
                  <span className="font-bold text-zinc-100">{weight || 0}kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-emerald-500/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-emerald-950/30 p-5 rounded-2xl border border-emerald-500/5 transition-all hover:bg-emerald-950/40">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Rotina Ativa</p>
                <p className="text-base font-bold text-zinc-100">{activityLabel || "Não informado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-emerald-950/30 p-5 rounded-2xl border border-emerald-500/5 transition-all hover:bg-emerald-950/40">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <Target size={24} />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Foco Semanal</p>
                <p className="text-base font-bold text-zinc-100">{goalLabel || "Não informado"}</p>
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
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-100 to-amber-200 uppercase tracking-tighter text-center">
              Seu Planejamento Nutricional
            </h2>
            <span className="text-2xl drop-shadow-sm">✨</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-zinc-900/50 border border-emerald-500/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl"><Flame className="w-6 h-6 text-emerald-400" /></div>
              <h3 className="text-xl font-bold text-zinc-100">Energia & Hidratação</h3>
            </div>
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Meta de Queima</p>
                  <p className="text-4xl font-black text-emerald-400 tracking-tighter">{(metaCalorias || 0).toLocaleString()} <span className="text-base font-bold text-zinc-500 uppercase tracking-normal">kcal</span></p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Água</p>
                  <p className="text-3xl font-black text-blue-400 tracking-tighter">{metaAgua || 0} <span className="text-base font-bold text-zinc-500 uppercase tracking-normal">ml</span></p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-zinc-900/50 border border-emerald-500/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-amber-500/10 rounded-xl"><Zap className="w-6 h-6 text-amber-400" /></div>
              <h3 className="text-xl font-bold text-zinc-100">Macro Distribuição</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/5 transition-colors hover:bg-emerald-950/30">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Proteína</p>
                <p className="text-3xl font-black text-zinc-100 tracking-tighter">{proteina || 0}g</p>
              </div>
              <div className="text-center p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/5 transition-colors hover:bg-emerald-950/30">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Carbo</p>
                <p className="text-3xl font-black text-zinc-100 tracking-tighter">{carbo || 0}g</p>
              </div>
              <div className="text-center p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/5 transition-colors hover:bg-emerald-950/30">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Gordura</p>
                <p className="text-3xl font-black text-zinc-100 tracking-tighter">{gordura || 0}g</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Seção Premium de Cardápio e Lista com Accordion (Fechado por padrão) */}
        <div className="mt-12 space-y-4">
          {cardapio && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="cardapio" className="border border-emerald-500/20 rounded-3xl bg-zinc-900/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                <AccordionTrigger className="px-8 py-6 hover:no-underline">
                  <div className="flex items-center gap-3 text-emerald-400 font-bold">
                    <Utensils className="w-5 h-5" />
                    Cardápio Personalizado
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8">
                  <div className="whitespace-pre-wrap text-sm md:text-base text-zinc-200 leading-relaxed font-medium bg-black/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                    {renderFormattedText(cardapio)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {lista && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="lista" className="border border-emerald-500/20 rounded-3xl bg-zinc-900/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                <AccordionTrigger className="px-8 py-6 hover:no-underline">
                  <div className="flex items-center gap-3 text-emerald-400 font-bold">
                    <ClipboardList className="w-5 h-5" />
                    Lista de Compras
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8">
                  <div className="whitespace-pre-wrap text-sm md:text-base text-zinc-200 leading-relaxed font-medium bg-black/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                    {renderFormattedText(lista)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          whileHover={canRequestPlan() || user?.email === ADMIN_EMAIL ? { scale: 1.02, y: -2 } : {}}
          whileTap={canRequestPlan() || user?.email === ADMIN_EMAIL ? { scale: 0.98 } : {}}
          className={`block w-full relative group transition-all duration-300 mt-12 ${( (!canRequestPlan() || isBlocked) && user?.email !== ADMIN_EMAIL) ? 'opacity-80' : ''}`}
        >
          <div className={`absolute -inset-1 rounded-[2rem] blur opacity-25 transition duration-1000 ${ (canRequestPlan() && !isBlocked) || user?.email === ADMIN_EMAIL ? 'bg-gradient-to-r from-emerald-500 to-amber-500 group-hover:opacity-50 group-hover:duration-200' : 'bg-zinc-500'}`} />
          <div className={`relative rounded-[2rem] p-5 shadow-2xl flex flex-col items-center text-center gap-3 overflow-hidden ${ (canRequestPlan() && !isBlocked) || user?.email === ADMIN_EMAIL ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
            <div className="flex items-center gap-3">
              { (canRequestPlan() && !isBlocked) || user?.email === ADMIN_EMAIL ? <MessageCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              <h3 className="text-lg font-black uppercase tracking-tight">
                {user?.email === ADMIN_EMAIL ? "Solicitar Cardápio (Modo Admin)" : isSubscriptionInactive ? "Acesso Bloqueado" : isUnicaDelivered ? "Cardápio Entregue" : "Solicitar Cardápio de Elite"}
              </h3>
            </div>
          </div>
        </motion.a>

        {(isBlocked && user?.email !== ADMIN_EMAIL) && (
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