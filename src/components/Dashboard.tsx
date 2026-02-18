import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Flame, Zap, Droplets, Activity, Target, UtensilsCrossed, Camera, Loader2, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";
import HealthReminder from "./HealthReminder";

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
  onAvatarUpdate?: () => void;
  onLogout?: () => void;
}

const Dashboard = ({
  name, age, sex, height, weight, activityLabel, goalLabel,
  tmb, get, metaCalorias, metaAgua, proteina, carbo, gordura, whatsapp,
  restrictions, preferences, avatarUrl, onAvatarUpdate, onLogout
}: DashboardProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | undefined>(avatarUrl);

  useEffect(() => {
    if (avatarUrl) {
      setLocalAvatarUrl(avatarUrl);
    }
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

  const whatsappUrl = `https://wa.me/5511910183401?text=${encodeURIComponent("*Quero Meu Planejamento da Semana Agora*")}`;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Header com Logout */}
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

        {/* Novo Lembrete de Saúde Refinado */}
        <HealthReminder />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Perfil - Esquerda */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 glass rounded-3xl p-8 shadow-card h-fit"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                <Avatar key={localAvatarUrl} className="w-32 h-32 border-4 border-white shadow-xl overflow-hidden">
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

          {/* Dados - Direita */}
          <div className="lg:col-span-7 space-y-6">
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
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">TMB</span>
                  <p className="text-sm font-bold">{tmb.toLocaleString("pt-BR")} kcal</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">GET</span>
                  <p className="text-sm font-bold">{get.toLocaleString("pt-BR")} kcal</p>
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
                <div className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-2">Proteína</span>
                  <p className="text-2xl font-black text-foreground">{proteina}g</p>
                </div>
                <div className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-2">Carbo</span>
                  <p className="text-2xl font-black text-foreground">{carbo}g</p>
                </div>
                <div className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-2">Gordura</span>
                  <p className="text-2xl font-black text-foreground">{gordura}g</p>
                </div>
              </div>
            </motion.div>

            {(restrictions || preferences) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3, duration: 0.5 }}
                className="glass rounded-3xl p-8 shadow-card grid grid-cols-1 sm:grid-cols-2 gap-8"
              >
                {restrictions && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-red-500" /> Restrições
                    </span>
                    <p className="text-sm text-foreground leading-relaxed bg-white/50 p-4 rounded-2xl border border-border">{restrictions}</p>
                  </div>
                )}
                {preferences && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Preferências</span>
                    <p className="text-sm text-foreground leading-relaxed bg-white/50 p-4 rounded-2xl border border-border">{preferences}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
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
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="block w-full bg-whatsapp text-whatsapp-foreground rounded-3xl p-6 shadow-whatsapp animate-pulse-glow transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <span className="text-xl font-black uppercase tracking-tight">Receber Meu Plano Grátis Agora</span>
              </div>
              <p className="text-xs font-medium opacity-90 text-center max-w-lg">
                Seu cardápio de 7 dias e lista de compras serão gerados instantaneamente e enviados para seu celular.
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