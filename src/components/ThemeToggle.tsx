"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  isPremium: boolean;
}

const ThemeToggle = ({ isPremium }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Se não for premium ou não estiver montado, não renderiza nada
  if (!isPremium || !mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center gap-2 p-2 rounded-2xl bg-secondary border border-border hover:border-primary/30 transition-all group"
      title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
    >
      <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={false}
          animate={{ y: isDark ? 0 : 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute"
        >
          <Moon size={20} className="text-primary" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ y: isDark ? -40 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute"
        >
          <Sun size={20} className="text-amber-500" />
        </motion.div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest pr-2 hidden sm:block">
        {isDark ? "Dark" : "Light"}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;