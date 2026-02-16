import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Flame, Zap, Droplets, Activity, Target, UtensilsCrossed, Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

const Dashboard = ({
  name, age, sex, height, weight, activityLabel, goalLabel,
  tmb, get, metaCalorias, metaAgua, proteina, carbo, gordura, whatsapp,
  restrictions, preferences, avatarUrl, onAvatarUpdate
}: DashboardProps) => {
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
      // Limpa o whatsapp para garantir que bate com o banco
      const cleanWhatsapp = whatsapp.trim();
      const fileExt = file.name.split('.').pop();
      const fileName = `${cleanWhatsapp.replace(/\D/g, '')}-${Date.now()}.${fileExt}`;
      
      // 1. Upload para o Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw new Error(`Erro no Storage: ${uploadError.message}`);

      // 2. Pegar URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // 3. Salvar no Banco (AQUI É ONDE ESTAVA DANDO ERRO DE PERMISSÃO)
      const { data, error: updateError, status } = await supabase
        .from('usuarios_planogratis')
        .update({ avatar_url: publicUrl })
        .eq('whatsapp', cleanWhatsapp)
        .select();

      // Se o status for 403 ou não retornar dados, é erro de RLS
      if (updateError || !data || data.length === 0) {
        console.error("Erro de atualização:", updateError || "Nenhuma linha afetada");
        throw new Error("O banco recusou a gravação. Verifique se você criou a 'Policy de UPDATE' no Supabase.");
      }

      // 4. Sucesso: Atualiza visual com timestamp para evitar cache
      setLocalAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      toast.success("Foto salva no banco com sucesso!");
      
      if (onAvatarUpdate) onAvatarUpdate();
    } catch (error: any) {
      console.error("Falha total:", error);
      toast.error(error.message || "Erro ao salvar foto.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Sou ${name} e quero receber meu Plano 7 🥗\n\n` +
    `Meu TMB: ${tmb} kcal\n` +
    `Meu GET: ${get} kcal\n` +
    `Meta: ${metaCalorias} kcal\n` +
    `Objetivo: ${goalLabel}\n` +
    (restrictions ? `Restrições: ${restrictions}\n` : "") +
    (preferences ? `Preferências: ${preferences}\n` : "") +
    `\nPor favor, gere meu cardápio semanal e lista de compras!`
  );
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 shadow-card mb-6">
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
            <div><span className="text-xs font-semibold text-muted-foreground uppercase">Sexo</span><p className="font-bold">{sex === "male" ? "Masculino" : "Feminino"}</p></div>
            <div><span className="text-xs font-semibold text-muted-foreground uppercase">Idade</span><p className="font-bold">{age} anos</p></div>
            <div><span className="text-xs font-semibold text-muted-foreground uppercase">Altura</span><p className="font-bold">{(height / 100).toFixed(2).replace(".", ",")} m</p></div>
            <div><span className="text-xs font-semibold text-muted-foreground uppercase">Peso</span><p className="font-bold">{weight} kg</p></div>
          </div>
        </motion.div>

        {/* Macros & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="glass rounded-2xl p-5 shadow-card">
            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2"><Droplets className="w-4 h-4 text-primary" /> Energia</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-xs text-muted-foreground">Meta Kcal</span><p className="text-xl font-extrabold text-primary">{metaCalorias} kcal</p></div>
              <div><span className="text-xs text-muted-foreground">Água</span><p className="text-xl font-extrabold text-primary">{metaAgua} ml</p></div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 shadow-card">
            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Macros</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 border rounded-lg"><span className="text-[10px]">Prot</span><p className="font-bold">{proteina}g</p></div>
              <div className="p-2 border rounded-lg"><span className="text-[10px]">Carb</span><p className="font-bold">{carbo}g</p></div>
              <div className="p-2 border rounded-lg"><span className="text-[10px]">Gord</span><p className="font-bold">{gordura}g</p></div>
            </div>
          </div>
        </div>

        <motion.a href={whatsappUrl} target="_blank" className="block w-full bg-whatsapp text-white rounded-2xl p-6 shadow-whatsapp text-center animate-pulse-glow">
          <div className="flex items-center justify-center gap-3 mb-1"><MessageCircle className="w-6 h-6" /><span className="text-lg font-bold">Receber Plano no WhatsApp</span></div>
          <p className="text-xs opacity-90">Clique para receber seu cardápio agora!</p>
        </motion.a>
      </div>
    </div>
  );
};

export default Dashboard;