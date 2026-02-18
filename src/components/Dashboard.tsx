import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Flame, Zap, Droplets, Activity, Target, UtensilsCrossed, Camera, Loader2, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PricingSection from "./PricingSection";
import FAQSection from "./FAQSection";

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
      <div className="w-full max-w-2xl mx-auto">
        
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6 shadow-card mb-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="relative group">
              <Avatar key={localAvatarUrl} className="w-24 h-24 border-4 border-white shadow-lg overflow-hidden">
                <AvatarImage src={localAvatarUrl} alt={name} className="object-cover w-full h-full" />
                <AvatarFallback className="bg-secondary text-primary text-2xl font-bold">
                  {name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors group-hover:scale-110 duration-200">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
              </label>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">Seu planejamento nutricional personalizado.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sexo(biológico)</span>
              <p className="font-bold text-foreground">{sex === "male" ? "Masculino" : "Feminino"}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Idade</span>
              <p className="font-bold text-foreground">{age} anos</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Altura</span>
              <p className="font-bold text-foreground">{(height / 100).toFixed(2).replace(".", ",")} m</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Peso</span>
              <p className="font-bold text-foreground">{weight} kg</p>
            </div>
            <div className="col-span-2 sm:col-span-4 mt-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nível de Atividade</span>
              <p className="font-bold text-foreground flex items-center gap-1"><Activity className="w-4 h-4 text-primary" /> {activityLabel}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Objetivo</span>
            <p className="font-bold text-foreground flex items-center gap-1"><Target className="w-4 h-4 text-accent" /> {goalLabel}</p>
          </div>

          {(restrictions || preferences) && (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
              {restrictions && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3" /> Restrições
                  </span>
                  <p className="text-sm text-foreground mt-1">{restrictions}</p>
                </div>
              )}
              {preferences && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preferências</span>
                  <p className="text-sm text-foreground mt-1">{preferences}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-6">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5" /> Planejamento Nutricional
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5 shadow-card">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" /> Energia & Hidratação
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs text-muted-foreground">Meta Calorias</span>
                  <p className="text-xl font-extrabold text-primary">{metaCalorias.toLocaleString("pt-BR", { minimumFractionDigits: 0 })} kcal</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Meta Água</span>
                  <p className="text-xl font-extrabold text-primary">{metaAgua} ml</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Taxa Metabólica (TMB)</span>
                  <p className="font-bold text-foreground">{tmb.toLocaleString("pt-BR")} kcal</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Gasto Total (GET)</span>
                  <p className="font-bold text-foreground">{get.toLocaleString("pt-BR")} kcal</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 shadow-card">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Macronutrientes (Diário)
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-border p-3">
                  <span className="text-xs text-muted-foreground">Proteína</span>
                  <p className="text-xl font-extrabold text-foreground">{proteina}g</p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <span className="text-xs text-muted-foreground">Carbo</span>
                  <p className="text-xl font-extrabold text-foreground">{carbo}g</p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <span className="text-xs text-muted-foreground">Gordura</span>
                  <p className="text-xl font-extrabold text-foreground">{gordura}g</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Seção de Planos Pagos */}
        <PricingSection />

        <div className="text-center mb-4">
          <p className="text-[11px] text-muted-foreground font-medium italic">
            ou continue com o plano gratuito
          </p>
        </div>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block w-full bg-whatsapp text-whatsapp-foreground rounded-2xl p-6 shadow-whatsapp animate-pulse-glow transition-all duration-300 hover:shadow-[0_0_40px_hsla(142,70%,49%,0.4)]"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <MessageCircle className="w-7 h-7" />
            <span className="text-xl font-bold uppercase">Receber Meu Plano 7 GRÁTIS AGORA</span>
          </div>
          <p className="text-sm opacity-90 text-center">
            Clique para gerar sua lista de compras e cardápio semanal instantaneamente.
          </p>
        </motion.a>

        {/* FAQ Section */}
        <FAQSection />
      </div>
    </div>
  );
};

export default Dashboard;