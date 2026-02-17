import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Flame, Zap, Droplets, Activity, Target, UtensilsCrossed, Camera, Loader2, Crown, Star, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  onAvatarUpdate?: () => void;
}

const PremiumDashboard = ({
  name, age, sex, height, weight, activityLabel, goalLabel,
  tmb, get, metaCalorias, metaAgua, proteina, carbo, gordura, whatsapp,
  restrictions, preferences, avatarUrl, onAvatarUpdate
}: PremiumDashboardProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | undefined>(avatarUrl);

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
      const fileName = `${whatsapp.replace(/\D/g, '')}_premium.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true, cacheControl: '0' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const timestampedUrl = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('clientes_pagos')
        .update({ avatar_url: publicUrl })
        .eq('whatsapp', whatsapp);

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

  const whatsappUrl = `https://wa.me/5511910183401?text=${encodeURIComponent("*Olá, sou cliente Premium e quero meu planejamento completo da semana*")}`;

  // Garantir que valores numéricos não sejam nulos para evitar erros de renderização
  const safeMetaCalorias = metaCalorias || 0;
  const safeTmb = tmb || 0;
  const safeGet = get || 0;
  const safeMetaAgua = metaAgua || 0;
  const safeProteina = proteina || 0;
  const safeCarbo = carbo || 0;
  const safeGordura = gordura || 0;

  return (
    <div className="min-h-screen bg-[#051c14] text-zinc-100 px-6 py-10">
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Header Premium */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-2 text-amber-400 font-bold tracking-widest uppercase text-xs">
            <Crown className="w-4 h-4" />
            Membro Premium
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4" />
            Acesso Vitalício
          </div>
        </motion.div>

        {/* Card de Perfil Premium */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/40 to-zinc-900/80 border border-emerald-500/20 p-8 shadow-2xl mb-8 backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Star className="w-32 h-32 text-amber-400 rotate-12" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-emerald-400 rounded-full blur opacity-30 animate-pulse" />
              <Avatar className="w-32 h-32 border-2 border-emerald-500/30 shadow-2xl">
                <AvatarImage src={localAvatarUrl} className="object-cover" />
                <AvatarFallback className="bg-emerald-950 text-emerald-400 text-3xl font-bold">
                  {name ? name.substring(0, 2).toUpperCase() : "??"}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-1 right-1 p-2.5 bg-amber-500 text-emerald-950 rounded-full cursor-pointer shadow-lg hover:bg-amber-400 transition-all hover:scale-110">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-white mb-1 tracking-tight">{name || "Usuário"}</h2>
              <p className="text-emerald-400/80 font-medium mb-6">Seu Plano de Elite Personalizado</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">Idade</span>
                  <span className="font-bold text-zinc-200">{age || 0} anos</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">Altura</span>
                  <span className="font-bold text-zinc-200">{(height ? height/100 : 0).toFixed(2)}m</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">Peso</span>
                  <span className="font-bold text-zinc-200">{weight || 0}kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-emerald-500/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/5">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Atividade</p>
                <p className="text-sm font-bold text-zinc-200">{activityLabel || "Não informado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/5">
              <Target className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Objetivo</p>
                <p className="text-sm font-bold text-zinc-200">{goalLabel || "Não informado"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metas Nutricionais Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/50 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Flame className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-zinc-200">Energia & Hidratação</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Meta Diária</p>
                  <p className="text-3xl font-black text-emerald-400">{safeMetaCalorias.toLocaleString()} <span className="text-sm font-normal text-zinc-500">kcal</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Água</p>
                  <p className="text-2xl font-black text-blue-400">{safeMetaAgua} <span className="text-sm font-normal text-zinc-500">ml</span></p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">TMB</p>
                  <p className="font-bold text-zinc-300">{safeTmb.toLocaleString()} kcal</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">GET</p>
                  <p className="font-bold text-zinc-300">{safeGet.toLocaleString()} kcal</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/50 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-bold text-zinc-200">Macronutrientes</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/5">
                <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Proteína</p>
                <p className="text-2xl font-black text-zinc-100">{safeProteina}g</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/5">
                <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Carbo</p>
                <p className="text-2xl font-black text-zinc-100">{safeCarbo}g</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/5">
                <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Gordura</p>
                <p className="text-2xl font-black text-zinc-100">{safeGordura}g</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-[10px] text-amber-400 font-bold uppercase mb-1">Dica Premium</p>
              <p className="text-xs text-zinc-400 leading-relaxed">Seu plano foi otimizado para máxima absorção de nutrientes e performance.</p>
            </div>
          </motion.div>
        </div>

        {/* Preferências e Restrições */}
        {(restrictions || preferences) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/30 border border-emerald-500/5 rounded-3xl p-8 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {restrictions && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <UtensilsCrossed className="w-4 h-4 text-red-400" />
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Restrições</h4>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{restrictions}</p>
                </div>
              )}
              {preferences && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Preferências</h4>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{preferences}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CTA Premium WhatsApp */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="block w-full relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-emerald-600 text-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-4 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
              <MessageCircle className="w-24 h-24" />
            </div>
            <MessageCircle className="w-10 h-10" />
            <div>
              <h3 className="text-2xl font-black mb-2">Solicitar Cardápio de Elite</h3>
              <p className="text-emerald-100 text-sm opacity-90">Fale agora com seu consultor e receba sua lista de compras e cardápio exclusivo.</p>
            </div>
          </div>
        </motion.a>

      </div>
    </div>
  );
};

export default PremiumDashboard;