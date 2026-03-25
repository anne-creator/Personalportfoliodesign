import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);
  const setTheme = useCallback((dark: boolean) => setIsDark(dark), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Provides a fixed isDark value to all children, overriding the global theme
 * context. Used by SplitIntro to render two copies of the site with different
 * themes simultaneously.
 */
export function ThemeScope({ isDark, children }: { isDark: boolean; children: ReactNode }) {
  const value = useMemo(
    () => ({ isDark, toggleTheme: () => {}, setTheme: () => {} }),
    [isDark],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}