import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { MessageCircle, Flame, Zap, Activity, Target, UtensilsCrossed, Camera, Loader2, LogOut, Lock, CheckCircle2, ClipboardList, Utensils, X, ShieldAlert, Heart } from "lucide-react";
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

  const isBlocked = entregue === true;
  const whatsappUrl = isBlocked ? "#" : `https://wa.me/5511933735838?text=${encodeURIComponent("*Quero Meu Planejamento da Semana Agora*")}`;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (isBlocked) {
      e.preventDefault();
      toast.error("Seu plano gratuito já foi entregue.");
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
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7 space-y-6">
            <ImpactPhrase goal={goalLabel} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                  <Flame size={16} /> Calorias Diárias
                </h3>
                <p className="text-3xl font-black text-zinc-900">
                  {metaCalorias} <span className="text-sm font-bold text-zinc-400">kcal</span>
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-blue-500 mb-4 flex items-center gap-2">
                  <Zap size={16} /> Água
                </h3>
                <p className="text-3xl font-black text-zinc-900">
                  {metaAgua} <span className="text-sm font-bold text-zinc-400">ml</span>
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-widest">Macronutrientes</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-50 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Prot</span>
                  <p className="text-xl font-black text-zinc-900">{proteina}g</p>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Carb</span>
                  <p className="text-xl font-black text-zinc-900">{carbo}g</p>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Gord</span>
                  <p className="text-xl font-black text-zinc-900">{gordura}g</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-600">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Restrições</span>
                </div>
                <p className="text-sm font-medium text-zinc-700 bg-zinc-50 p-5 rounded-2xl border border-zinc-100 min-h-[100px]">
                  {restrictions || "Nenhuma restrição informada."}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Heart className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Preferências</span>
                </div>
                <p className="text-sm font-medium text-zinc-700 bg-zinc-50 p-5 rounded-2xl border border-zinc-100 min-h-[100px]">
                  {preferences || "Nenhuma preferência informada."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {cardapio && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full bg-white border-2 border-primary/20 p-5 rounded-2xl text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                      <Utensils size={20} /> Ver Cardápio
                    </button>
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
                    <button className="w-full bg-white border-2 border-primary/20 p-5 rounded-2xl text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                      <ClipboardList size={20} /> Ver Lista
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Lista de Compras</DialogTitle></DialogHeader>
                    <div className="whitespace-pre-wrap text-zinc-700 bg-zinc-50 p-6 rounded-xl border">{renderFormattedText(lista)}</div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              whileHover={!isBlocked ? { scale: 1.02 } : {}}
              whileTap={!isBlocked ? { scale: 0.98 } : {}}
              className={`block w-full rounded-2xl p-6 text-center transition-all shadow-whatsapp mt-6 ${
                isBlocked ? "bg-zinc-100 text-zinc-400" : "bg-whatsapp text-white"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  {isBlocked ? <Lock size={20} /> : <MessageCircle size={24} />}
                  <span className="text-xl font-black uppercase tracking-tight">
                    {isBlocked ? "Acesso Grátis Finalizado" : "Receber Plano no WhatsApp"}
                  </span>
                </div>
                {!isBlocked && <p className="text-xs font-medium opacity-90">Clique para enviar seu planejamento agora!</p>}
              </div>
            </motion.a>
          </div>
        </div>

        <PricingSection />
        <FAQSection />
      </div>
    </div>
  );
};

export default Dashboard;