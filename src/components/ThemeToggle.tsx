import { motion } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--t-text-muted)",
        background: isDark ? "rgba(16, 16, 24, 0.85)" : "rgba(250, 248, 245, 0.85)",
        border: "1px solid var(--t-border)",
        backdropFilter: "blur(12px)",
      }}
      whileHover={{
        borderColor: "var(--t-accent)",
        scale: 1.02,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun size={14} strokeWidth={1.5} />
        ) : (
          <Moon size={14} strokeWidth={1.5} />
        )}
      </motion.div>
      <span>{isDark ? "light" : "dark"}</span>
    </motion.button>
  );
}