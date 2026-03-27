"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Save, Plus, Minus } from "lucide-react";

interface PremiumEditFormProps {
  initialData: {
    name: string;
    age: number;
    sex: string;
    height: number;
    weight: number;
    activity: string;
    goal: string;
    restrictions: string;
    preferences: string;
  };
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

const activityOptions = [
  { id: "Sedentário", label: "Sedentário" },
  { id: "Levemente ativo", label: "Levemente ativo" },
  { id: "Moderadamente ativo", label: "Moderadamente ativo" },
  { id: "Muito ativo", label: "Muito ativo" },
  { id: "Extremamente ativo", label: "Extremamente ativo" },
];

const goalOptions = [
  { id: "Perder Peso / Emagrecer", label: "Perder Peso" },
  { id: "Ganhar Massa Muscular (Hipertrofia)", label: "Ganhar Massa" },
  { id: "Alimentação Saudável", label: "Manter Saúde" },
];

const PremiumEditForm = ({ initialData, onSave, onClose }: PremiumEditFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [heightInput, setHeightInput] = useState((initialData.height / 100).toFixed(2).replace(".", ","));

  const handleHeightChange = (increment: number) => {
    // TRAVA RIGOROSA: 2,10m
    const nextHeight = Math.max(50, Math.min(210, formData.height + increment));
    setFormData({ ...formData, height: nextHeight });
    setHeightInput((nextHeight / 100).toFixed(2).replace(".", ","));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-emerald-500/20 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-emerald-500/10 flex items-center justify-between bg-emerald-950/20">
          <h2 className="text-xl font-bold text-white">Atualizar Perfil Elite</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-emerald-500 mb-1.5">Idade (Máx 100)</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFormData({...formData, age: Math.max(1, formData.age - 1)})} className="p-2 bg-zinc-800 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                  <Minus size={14} />
                </button>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={formData.age === 0 ? "" : formData.age}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").replace(/^0+/, "");
                    const num = val === "" ? 0 : Math.min(100, parseInt(val));
                    setFormData({...formData, age: num});
                  }}
                  className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-2 py-2 text-white text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button type="button" onClick={() => setFormData({...formData, age: Math.min(100, formData.age + 1)})} className="p-2 bg-zinc-800 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-emerald-500 mb-1.5">Peso (Máx 125kg)</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFormData({...formData, weight: Math.max(20, formData.weight - 1)})} className="p-2 bg-zinc-800 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                  <Minus size={14} />
                </button>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={formData.weight === 0 ? "" : formData.weight}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").replace(/^0+/, "");
                    const num = val === "" ? 0 : Math.min(125, parseInt(val));
                    setFormData({...formData, weight: num});
                  }}
                  className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-2 py-2 text-white text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button type="button" onClick={() => setFormData({...formData, weight: Math.min(125, formData.weight + 1)})} className="p-2 bg-zinc-800 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-emerald-500 mb-1.5">Altura (Máx 2,10m)</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => handleHeightChange(-1)} className="p-3 bg-zinc-800 rounded-xl text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                <Minus size={18} />
              </button>
              <input 
                type="text" 
                readOnly
                value={heightInput}
                className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-xl font-bold outline-none"
              />
              <button type="button" onClick={() => handleHeightChange(1)} className="p-3 bg-zinc-800 rounded-xl text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-emerald-500 mb-1.5">SEXO(Biológico)</label>
            <select 
              value={formData.sex}
              onChange={(e) => setFormData({...formData, sex: e.target.value})}
              className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-emerald-500 mb-1.5">Atividade Física</label>
            <select 
              value={formData.activity}
              onChange={(e) => setFormData({...formData, activity: e.target.value})}
              className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {activityOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-emerald-500 mb-1.5">Objetivo</label>
            <select 
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {goalOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-emerald-500 mb-1.5">Restrições</label>
            <textarea 
              value={formData.restrictions}
              onChange={(e) => setFormData({...formData, restrictions: e.target.value})}
              className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none h-20 resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-emerald-500 mb-1.5">Preferências</label>
            <textarea 
              value={formData.preferences}
              onChange={(e) => setFormData({...formData, preferences: e.target.value})}
              className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none h-20 resize-none text-sm"
            />
          </div>
        </form>

        <div className="p-6 bg-emerald-950/10 border-t border-emerald-500/10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar e Recalcular</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumEditForm;