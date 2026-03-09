import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Flame, Activity, Target, UtensilsCrossed, Camera, Loader2, LogOut, Lock, CheckCircle2, ClipboardList, Utensils, X, ShieldAlert, Heart, Droplets, Beef, Wheat, Pizza, AlertCircle } from "lucide-react";
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
import EasterBonus from "./EasterBonus";
import DashboardLiveCounter from "./DashboardLiveCounter";

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
  onAvatarUpdate?: () => void;
  onLogout?: () => void;
}

const Dashboard = ({
  name, age, sex, height, weight, activityLabel, goalLabel,
  tmb, get, metaCalorias, metaAgua, proteina, carbo, gordura, whatsapp,
  restrictions, preferences, avatarUrl, entregue, cardapio, lista, onAvatarUpdate, onLogout
}: DashboardProps) => {
  const { setTheme } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | undefined>(avatarUrl);

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

  return (
    <div className="min-h-screen px-6 py-10 bg-background text-foreground">
      <div className="w-full max-w-4xl mx-auto">
        
        <div className="flex justify-end mb-4">
          {onLogout && (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider"
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
            className="lg:col-span-5 bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm h-fit"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-zinc-50 shadow-md">
                  <AvatarImage src={localAvatarUrl} alt={name} className="object-cover" />
                  <AvatarFallback className="bg-zinc-100 text-primary text-3xl font-bold">
                    {name?.substring(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                
                <label className="absolute bottom-1 right-1 p-3 bg-primary text-white rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-5 h-5" />}
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                </label>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">
                  Plano Gratuito
                </div>
                <h2 className="text-2xl font-bold text-zinc-900">{name}</h2>
                <p className="text-sm text-zinc-500">Membro Plano 7</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 text-sm border-y border-zinc-100 py-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Idade</span>
                  <p className="font-bold text-zinc-900">{age} anos</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Peso</span>
                  <p className="font-bold text-zinc-900">{weight} kg</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Altura</span>
                  <p className="font-bold text-zinc-900">{(height / 100).toFixed(2).replace(".", ",")} m</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sexo</span>
                  <p className="font-bold text-zinc-900">{sex === "male" ? "Masculino" : "Feminino"}</p>
                </div>
              </div>

              <div className="w-full text-left space-y-4">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Atividade</span>
                  <p className="text-sm font-bold text-zinc-900">{activityLabel}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="text-[10px] font-bold text-orange-600 uppercase block mb-1">Objetivo</span>
                  <p className="text-sm font-bold text-zinc-900">{goalLabel}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Restrições</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-700">
                    {restrictions || "Nenhuma restrição informada."}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Heart className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Preferências</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-700">
                    {preferences || "Nenhuma preferência informada."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7 space-y-6">
            <ImpactPhrase goal={goalLabel} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Flame size={80} />
                </div>
                <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                  <Flame size={16} /> Calorias Diárias
                </h3>
                <p className="text-4xl font-black text-zinc-900 tracking-tighter">
                  {metaCalorias} <span className="text-sm font-bold text-zinc-400 uppercase tracking-normal">kcal</span>
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Droplets size={80} />
                </div>
                <h3 className="text-sm font-bold text-blue-500 mb-4 flex items-center gap-2">
                  <Droplets size={16} /> Meta de Água
                </h3>
                <p className="text-4xl font-black text-zinc-900 tracking-tighter">
                  {metaAgua} <span className="text-sm font-bold text-zinc-400 uppercase tracking-normal">ml</span>
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Macronutrientes</h3>
                <div className="h-px flex-1 bg-zinc-100 ml-4" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-50 rounded-2xl p-5 text-center border border-zinc-100 transition-colors hover:bg-zinc-100/50">
                  <Beef className="w-5 h-5 text-red-500 mx-auto mb-3" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Proteína</span>
                  <p className="text-2xl font-black text-zinc-900 tracking-tighter">{proteina}g</p>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-5 text-center border border-zinc-100 transition-colors hover:bg-zinc-100/50">
                  <Wheat className="w-5 h-5 text-amber-600 mx-auto mb-3" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Carbo</span>
                  <p className="text-2xl font-black text-zinc-900 tracking-tighter">{carbo}g</p>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-5 text-center border border-zinc-100 transition-colors hover:bg-zinc-100/50">
                  <Pizza className="w-5 h-5 text-orange-500 mx-auto mb-3" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Gordura</span>
                  <p className="text-2xl font-black text-zinc-900 tracking-tighter">{gordura}g</p>
                </div>
              </div>
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

            {/* Bônus de Páscoa da Vivi */}
            <EasterBonus goal={goalLabel} />
          </div>
        </div>

        <PricingSection />
        <FAQSection />
      </div>
    </div>
  );
};

export default Dashboard;