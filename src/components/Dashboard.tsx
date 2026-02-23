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

  // REGRA: Usuário gratuito é forçado ao Dark Mode
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  useEffect(() => {
    if (avatarUrl) {
      setLocalAvatarUrl(avatarUrl);
    }
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
      toast.success("Foto atualizada com sucesso!");
      if (onAvatarUpdate) onAvatarUpdate();
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast.error("Falha ao subir foto.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const isBlocked = entregue === true;
  const whatsappUrl = isBlocked ? "#" : `https://wa.me/5511933735838?text=${encodeURIComponent("*Quero Meu Planejamento da Semana Agora*")}`;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (isBlocked) {
      e.preventDefault();
      toast.error("Seu plano gratuito já foi entregue. Faça o upgrade para novos planos!");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-background text-foreground">
      <div className="w-full max-w-4xl mx-auto">
        
        <div className="flex justify-end mb-4">
          {onLogout && (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              Sair do Plano
            </button>
          )}
        </div>

        <HealthReminder />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 glass rounded-3xl p-8 shadow-card h-fit"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                <Avatar key={localAvatarUrl} className="w-32 h-32 border-4 border-white dark:border-zinc-800 shadow-xl overflow-hidden">
                  <AvatarImage src={localAvatarUrl} alt={name} className="object-cover w-full h-full" />
                  <AvatarFallback className="bg-secondary text-primary text-3xl font-bold">
                    {name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <label className="absolute bottom-1 right-1 p-3 bg-primary text-white rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-all hover:scale-110 duration-200">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-5 h-5" />}
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                </label>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                <p className="text-sm text-muted-foreground">Plano Nutricional Gratuito</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 text-sm border-y border-border py-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Idade</span>
                  <p className="font-bold text-foreground">{age} anos</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Peso</span>
                  <p className="font-bold text-foreground">{weight} kg</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Altura</span>
                  <p className="font-bold text-foreground">{(height / 100).toFixed(2).replace(".", ",")} m</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sexo</span>
                  <p className="font-bold text-foreground">{sex === "male" ? "Masculino" : "Feminino"}</p>
                </div>
              </div>

              <div className="w-full text-left space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Atividade Física</span>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 border border-border">
                    <Activity className="w-4 h-4 text-primary" />
                    <p className="text-sm font-bold text-foreground">{activityLabel}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Objetivo Semanal</span>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
                    <Target className="w-4 h-4 text-accent" />
                    <p className="text-sm font-bold text-foreground">{goalLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col items-center mb-2">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/20 to-primary/5 border border-primary/20 shadow-sm relative group"
              >
                <span className="text-xl drop-shadow-sm">💎</span>
                <h2 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-primary uppercase tracking-tight text-center">
                  Seu Planejamento Nutricional
                </h2>
                <span className="text-xl drop-shadow-sm">✨</span>
              </motion.div>
            </div>

            {/* Frase de Impacto Dinâmica */}
            <ImpactPhrase goal={goalLabel} />

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glass rounded-3xl p-8 shadow-card"
            >
              <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5" /> Energia & Hidratação
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground font-medium">Meta Diária de Calorias</span>
                  <p className="text-4xl font-black text-primary leading-none">
                    {metaCalorias.toLocaleString("pt-BR", { minimumFractionDigits: 0 })} <span className="text-lg font-bold">kcal</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground font-medium">Ingestão de Água Diária</span>
                  <p className="text-4xl font-black text-primary leading-none">
                    {metaAgua} <span className="text-lg font-bold">ml</span>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass rounded-3xl p-8 shadow-card"
            >
              <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5" /> Macronutrientes (Meta Diária)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-2xl border border-border p-5 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-2">Proteína</span>
                  <p className="text-2xl font-black text-foreground">{proteina}g</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-5 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-2">Carbo</span>
                  <p className="text-2xl font-black text-foreground">{carbo}g</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-5 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-2">Gordura</span>
                  <p className="text-2xl font-black text-foreground">{gordura}g</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.5 }}
              className="glass rounded-3xl p-8 shadow-card space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-600">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Restrições</span>
                  </div>
                  <p className="text-sm font-medium text-foreground bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 min-h-[80px]">
                    {restrictions || "Nenhuma restrição informada."}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Heart className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Preferências</span>
                  </div>
                  <p className="text-sm font-medium text-foreground bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 min-h-[80px]">
                    {preferences || "Nenhuma preferência informada."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cardapio && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-3 bg-card border-2 border-primary/20 p-6 rounded-3xl text-primary font-bold hover:bg-primary/5 transition-all shadow-sm group">
                  <Utensils className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Ver Cardápio Personalizado
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-0 border-none bg-background">
                <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3 text-primary font-bold text-xl">
                    <Utensils className="w-6 h-6" />
                    Cardápio Personalizado
                  </div>
                </div>
                <div className="p-8">
                  <div className="whitespace-pre-wrap text-base text-foreground leading-relaxed font-medium bg-secondary/20 p-8 rounded-2xl border border-border shadow-inner">
                    {renderFormattedText(cardapio)}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {lista && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-3 bg-card border-2 border-primary/20 p-6 rounded-3xl text-primary font-bold hover:bg-primary/5 transition-all shadow-sm group">
                  <ClipboardList className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Ver Lista de Compras
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-0 border-none bg-background">
                <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3 text-primary font-bold text-xl">
                    <ClipboardList className="w-6 h-6" />
                    Lista de Compras
                  </div>
                </div>
                <div className="p-8">
                  <div className="whitespace-pre-wrap text-base text-foreground leading-relaxed font-medium bg-secondary/20 p-8 rounded-2xl border border-border shadow-inner">
                    {renderFormattedText(lista)}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="mt-12 space-y-12">
          <PricingSection />

          <div className="text-center">
            <p className="text-xs text-muted-foreground font-bold italic tracking-wider uppercase">
              Ou continue com o seu acesso atual
            </p>
          </div>

          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            whileHover={!isBlocked ? { scale: 1.02, y: -5 } : {}}
            whileTap={!isBlocked ? { scale: 0.98 } : {}}
            className={`block w-full rounded-3xl p-6 transition-all duration-300 ${
              isBlocked 
                ? "bg-zinc-800 text-zinc-400 border border-zinc-700" 
                : "bg-whatsapp text-whatsapp-foreground shadow-whatsapp animate-pulse-glow"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-3">
                {isBlocked ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <MessageCircle className="w-6 h-6" />}
                <span className="text-xl font-black uppercase tracking-tight">
                  {isBlocked ? "Plano Gratuito Entregue" : "Receber Meu Plano Grátis Agora"}
                </span>
              </div>
              <p className="text-xs font-medium opacity-90 text-center max-w-lg">
                {isBlocked 
                  ? "Seu cardápio de 7 dias já foi enviado para seu WhatsApp. Faça o upgrade para novos planos!"
                  : "Seu cardápio de 7 dias e lista de compras serão gerados instantaneamente e enviados para seu celular."}
              </p>
            </div>
          </motion.a>

          <FAQSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;