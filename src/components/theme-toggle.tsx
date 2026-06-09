import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Ativar modo escuro" : "Ativar modo claro"}
      aria-pressed={isLight}
      title={isLight ? "Modo escuro" : "Modo claro"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)] ${className}`}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
