"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  isPremium: boolean;
}

const ThemeToggle = ({ isPremium }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  // Regra de Ouro: Se não for premium, não renderiza nada
  if (!isPremium) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2.5 rounded-xl bg-secondary/50 border border-border hover:bg-secondary transition-colors shadow-sm group"
      title="Alternar Tema"
    >
      <div className="relative w-5 h-5">
        <Sun className="absolute inset-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-emerald-400" />
      </div>
      <span className="sr-only">Alternar tema</span>
    </motion.button>
  );
};

export default ThemeToggle;