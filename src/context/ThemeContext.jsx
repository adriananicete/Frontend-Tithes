import { createContext, useCallback, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

const apply = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
};

export function ThemeProvider({ children }) {
  // Initialize from the class the anti-FOUC script in index.html already set,
  // so React state matches what's painted on screen.
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  // Keep the <html> class in sync whenever theme changes.
  useEffect(() => {
    apply(theme);
  }, [theme]);

  // Follow the OS preference, but only while the user hasn't made an explicit
  // choice (no saved 'theme'). Once they toggle, their choice wins.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (!localStorage.getItem("theme")) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}
