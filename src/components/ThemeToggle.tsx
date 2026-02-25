"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center gap-2 p-2 rounded-2xl bg-secondary border border-border hover:border-primary/30 transition-all shadow-sm z-50"
    >
      <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={false}
          animate={{ y: isDark ? 0 : 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute"
        >
          <Moon size={18} className="text-primary" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ y: isDark ? -30 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute"
        >
          <Sun size={18} className="text-amber-500" />
        </motion.div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest pr-2 hidden sm:block text-foreground">
        {isDark ? "Dark" : "Light"}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;