"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gift, Rabbit, Sparkles, Info, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EasterBonusProps {
  goal: string;
}

const EasterBonus = ({ goal }: EasterBonusProps) => {
  const safeGoal = goal || "";
  
  const isWeightLoss = safeGoal.toLowerCase().includes("perder") || 
                       safeGoal.toLowerCase().includes("emagrecer") || 
                       safeGoal === "lose_weight";
                       
  const isHypertrophy = safeGoal.toLowerCase().includes("ganhar") || 
                        safeGoal.toLowerCase().includes("hipertrofia") || 
                        safeGoal === "gain_muscle";

  const getRecipe = () => {
    if (isWeightLoss) {
      return {
        intro: "💬 Oi! Aqui é a Vivi! 🐰 Como estamos na época de Páscoa, preparei um presente especial para o seu Plano 7: um Ovo de Páscoa de colher que encaixa perfeitamente no seu déficit calórico. Dá pra matar a vontade de doce e continuar secando!",
        title: "👩‍🍳 RECEITA: Ovo de Colher Fit de Morango",
        ingredients: [
          "80g de Chocolate 70% cacau (para a casca)",
          "1 pote (170g) de Iogurte natural desnatado consistente",
          "1 xícara de Morangos picados",
          "1 colher de sopa de Adoçante culinário (opcional)",
          "1 colher de chá de Essência de baunilha"
        ],
        prep: [
          "Derreta o chocolate 70% no micro-ondas de 30 em 30 segundos.",
          "Espalhe o chocolate derretido em uma forminha de ovo de páscoa (250g) and leve ao congelador por 15 minutos até endurecer.",
          "Em uma tigela, misture o iogurte desnatado, a baunilha e o adoçante para criar o creme.",
          "Desenforme a casca de chocolate, preencha com o creme de iogurte e decore com os morangos picados por cima.",
          "Deixe na geladeira por 10 minutos antes de comer."
        ],
        footer: "⏱️ TEMPO: 30 minutos | 🍽️ PORÇÕES: 1 porção",
        tip: "🔄 Dica da Vivi: Essa receita é flexível! Se você tiver alguma restrição ou preferência, pode substituir o iogurte por creme de ricota light e o morango por qualquer outra fruta vermelha da sua preferência."
      };
    }

    if (isHypertrophy) {
      return {
        intro: "💬 Oi! Aqui é a Vivi! 🐰 Páscoa não é desculpa para perder os macros. Preparei um presente especial para o seu Plano 7: um Ovo de Páscoa proteico e calórico, perfeito para bater sua meta de construção muscular de forma deliciosa!",
        title: "👩‍🍳 RECEITA: Ovo Proteico de Amendoim e Whey",
        ingredients: [
          "100g de Chocolate meio amargo (para a casca)",
          "2 scoops (60g) de Whey Protein (sabor chocolate ou baunilha)",
          "2 colheres de sopa cheias de Pasta de amendoim integral",
          "2 colheres de sopa de Leite (apenas para dar o ponto)",
          "1 colher de sopa de Aveia em flocos ou amendoim triturado"
        ],
        prep: [
          "Derreta o chocolate meio amargo no micro-ondas de 30 em 30 segundos.",
          "Espalhe na forminha de ovo de páscoa e leve ao congelador por 15 minutos para firmar a casca.",
          "Para o recheio, misture o Whey Protein, a pasta de amendoim e vá adicionando o leite aos poucos até virar um creme denso e homogêneo.",
          "Preencha a casca de chocolate com esse creme proteico.",
          "Salpique a aveia ou o amendoim triturado por cima para dar crocância e deixe gelar por 10 minutos."
        ],
        footer: "⏱️ TEMPO: 25 minutos | 🍽️ PORÇÕES: 1 porção",
        tip: "🔄 Dica da Vivi: Essa receita é flexível! Se você tiver alguma restrição ou preferência, pode substituir o Whey por proteína vegetal, a pasta de amendoim por pasta de castanhas, e usar o leite da sua preferência."
      };
    }

    // Default: Vida Saudável
    return {
      intro: "💬 Oi! Aqui é a Vivi! 🐰 Quem disse que Páscoa não combina com saúde? Preparei um presente especial para o seu Plano 7: um Ovo de Páscoa funcional, feito com comida de verdade, para você aproveitar sem sair da rotina saudável!",
      title: "👩‍🍳 RECEITA: Ovo Funcional de Coco e Castanhas",
      ingredients: [
        "100g de Chocolate 50% ou 70% cacau (para a casca)",
        "4 colheres de sopa de Leite de coco em pó ou leite em pó desnatado",
        "2 colheres de sopa de Coco ralado sem açúcar",
        "Água quente (suficiente para dar ponto de creme)",
        "2 colheres de sopa de Mix de castanhas trituradas (pará, caju, nozes)"
      ],
      prep: [
        "Derreta o chocolate no micro-ondas, espalhe na forma de ovo de páscoa e leve ao congelador por 15 minutos.",
        "Em uma tigela, coloque o leite de coco em pó e o coco ralado. Vá pingando a água quente aos poucos e mexendo até formar um creme de \"beijinho\" saudável.",
        "Desenforme a casca do ovo, coloque uma camada das castanhas trituradas no fundo.",
        "Cubra tudo com o creme de coco.",
        "Finalize com mais um pouco de coco ralado por cima e deixe gelar por 10 minutos."
      ],
      footer: "⏱️ TEMPO: 25 minutos | 🍽️ PORÇÕES: 1 porção",
      tip: "🔄 Dica da Vivi: Essa receita é flexível! Se você tiver alguma restrição ou preferência, pode substituir as castanhas por sementes (como abóbora ou girassol) e usar o chocolate que melhor se adaptar à sua digestão."
    };
  };

  const recipe = getRecipe();

  return (
    <div className="mt-8">
      <Dialog>
        <DialogTrigger asChild>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-[2rem] font-semibold tracking-wide shadow-[0_15px_30px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(124,58,237,0.5)] transition-all flex items-center justify-center gap-3 border-b-4 border-purple-800 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Rabbit size={80} />
            </div>
            <Gift size={24} className="drop-shadow-md animate-bounce" />
            <span className="text-lg">Presente de Páscoa da Vivi Clique Aqui</span>
            <Sparkles size={20} className="text-amber-300 animate-pulse" />
          </motion.button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] p-0 border-none bg-white">
          <div className="sticky top-0 bg-purple-600 p-6 flex items-center justify-between z-10 text-white">
            <div className="flex items-center gap-3 font-black text-xl uppercase tracking-normal">
              <Rabbit className="w-6 h-6" />
              Presente de Páscoa
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Mensagem da Vivi */}
            <div className="flex gap-4 items-start bg-purple-50 p-6 rounded-3xl border border-purple-100">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Rabbit size={24} />
              </div>
              <p className="text-sm md:text-base font-medium text-purple-900 leading-relaxed italic">
                {recipe.intro}
              </p>
            </div>

            {/* Título da Receita */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 uppercase tracking-tight leading-tight">
                {recipe.title}
              </h2>
            </div>

            {/* Ingredientes */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide flex items-center gap-2">
                <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
                📝 INGREDIENTES:
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <CheckCircle2 className="text-purple-600 shrink-0" size={18} />
                    <p className="text-sm font-bold text-zinc-700">{ing}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modo de Preparo */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide flex items-center gap-2">
                <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
                🔪 MODO DE PREPARO:
              </h3>
              <div className="space-y-4">
                {recipe.prep.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                      {i + 1}
                    </div>
                    <p className="text-sm md:text-base font-medium text-zinc-700 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé da Receita */}
            <div className="text-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <p className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                {recipe.footer}
              </p>
            </div>

            {/* Dica da Vivi */}
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex gap-4 items-start">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-600 shrink-0">
                <Info size={20} />
              </div>
              <p className="text-sm font-bold text-amber-900 leading-relaxed">
                {recipe.tip}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EasterBonus;