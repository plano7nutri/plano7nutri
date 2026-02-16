import { motion } from "framer-motion";
import { MessageCircle, Flame, Zap, Droplets, User, Activity, Target } from "lucide-react";

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
}

const Dashboard = ({
  name, age, sex, height, weight, activityLabel, goalLabel,
  tmb, get, metaCalorias, metaAgua, proteina, carbo, gordura, whatsapp,
}: DashboardProps) => {
  const whatsappMessage = encodeURIComponent(
    `Olá! Sou ${name} e quero receber meu Plano 7 🥗\n\nMeu TMB: ${tmb} kcal\nMeu GET: ${get} kcal\nMeta: ${metaCalorias} kcal\nObjetivo: ${goalLabel}\n\nPor favor, gere meu cardápio semanal e lista de compras!`
  );
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="w-full max-w-2xl mx-auto">
        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Seu Perfil</h2>
              <p className="text-sm text-muted-foreground">Dados pessoais e planejamento nutricional.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</span>
              <p className="font-bold text-foreground">{name}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sexo</span>
              <p className="font-bold text-foreground">{sex === "male" ? "Masculino" : "Feminino"}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Idade</span>
              <p className="font-bold text-foreground">{age} anos</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Altura</span>
              <p className="font-bold text-foreground">{(height / 100).toFixed(2)} m</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Peso</span>
              <p className="font-bold text-foreground">{weight} kg</p>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nível de Atividade</span>
              <p className="font-bold text-foreground flex items-center gap-1"><Activity className="w-4 h-4 text-primary" /> {activityLabel}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Objetivo</span>
            <p className="font-bold text-foreground flex items-center gap-1"><Target className="w-4 h-4 text-accent" /> {goalLabel}</p>
          </div>
        </motion.div>

        {/* Nutritional Planning */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-6">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5" /> Planejamento Nutricional
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Energy & Hydration */}
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

            {/* Macros */}
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
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Valores calculados com base no seu objetivo: <strong>{goalLabel}</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp CTA */}
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
            <span className="text-xl font-bold">Receber Meu Plano 7 no WhatsApp</span>
          </div>
          <p className="text-sm opacity-90 text-center">
            Clique para gerar sua lista de compras e cardápio semanal instantaneamente.
          </p>
        </motion.a>
      </div>
    </div>
  );
};

export default Dashboard;
