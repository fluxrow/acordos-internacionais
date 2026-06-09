import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
const STORAGE_KEY = "ai-theme";

type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };
const ThemeContext = createContext<Ctx | null>(null);

function readInitial(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitial);

  const apply = useCallback((t: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (t === "light") root.classList.add("light");
    else root.classList.remove("light");
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* noop */
    }
  }, []);

  const setTheme = useCallback(
    (t: Theme) => {
      setThemeState(t);
      apply(t);
    },
    [apply],
  );

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  useEffect(() => {
    // Sync state with whatever the pre-paint script applied
    setThemeState(readInitial());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback no-op (allows usage outside provider during SSR/edge cases)
    return {
      theme: "dark",
      setTheme: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}

/** Inline script string — runs before first paint to avoid theme flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`;
