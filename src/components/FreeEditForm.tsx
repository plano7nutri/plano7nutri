"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Save, Plus, Minus, AlertTriangle } from "lucide-react";

interface FreeEditFormProps {
  initialData: {
    name: string;
    age: number;
    sex: string;
    height: number;
    weight: number;
    activity: string;
    goal: string;
  };
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

const FreeEditForm = ({ initialData, onSave, onClose }: FreeEditFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [heightInput, setHeightInput] = useState((initialData.height / 100).toFixed(2).replace(".", ","));

  const handleHeightChange = (increment: number) => {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-zinc-200"
      >
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Ajuste Único de Perfil</h2>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1 mt-1">
              <AlertTriangle size={12} /> Esta alteração só pode ser feita uma vez
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Nome Completo</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-zinc-900 focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Idade (Máx 100)</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFormData({...formData, age: Math.max(1, formData.age - 1)})} className="p-2 bg-zinc-100 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                  <Minus size={14} />
                </button>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: Math.min(100, Number(e.target.value))})}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2 py-2 text-zinc-900 text-center focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                />
                <button type="button" onClick={() => setFormData({...formData, age: Math.min(100, formData.age + 1)})} className="p-2 bg-zinc-100 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Peso (Máx 125kg)</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFormData({...formData, weight: Math.max(20, formData.weight - 1)})} className="p-2 bg-zinc-100 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                  <Minus size={14} />
                </button>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: Math.min(125, Number(e.target.value))})}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-2 py-2 text-zinc-900 text-center focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                />
                <button type="button" onClick={() => setFormData({...formData, weight: Math.min(125, formData.weight + 1)})} className="p-2 bg-zinc-100 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Altura (Máx 2,10m)</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => handleHeightChange(-1)} className="p-3 bg-zinc-100 rounded-xl text-primary hover:bg-primary/10 transition-colors">
                <Minus size={18} />
              </button>
              <input 
                type="text" 
                readOnly
                value={heightInput}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 text-center text-xl font-bold outline-none"
              />
              <button type="button" onClick={() => handleHeightChange(1)} className="p-3 bg-zinc-100 rounded-xl text-primary hover:bg-primary/10 transition-colors">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase">Sexo (Biológico)</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setFormData({...formData, sex: 'male'})}
                className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.sex === 'male' ? 'border-primary bg-primary/5 text-primary' : 'border-zinc-100 text-zinc-400'}`}
              >
                Masculino
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, sex: 'female'})}
                className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.sex === 'female' ? 'border-primary bg-primary/5 text-primary' : 'border-zinc-100 text-zinc-400'}`}
              >
                Feminino
              </button>
            </div>
          </div>
        </form>

        <div className="p-6 bg-zinc-50 border-t border-zinc-100">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-glow"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar e Recalcular</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FreeEditForm;