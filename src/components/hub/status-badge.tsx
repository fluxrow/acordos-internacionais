import { Crown, ShieldCheck, Sparkles, Lock, Star, Clock } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type Tone = "gold" | "gold-filled" | "neutral" | "muted" | "info";
type IconCmp = ComponentType<SVGProps<SVGSVGElement>>;

const ICONS: Record<string, IconCmp> = {
  pro: Crown,
  trial: Sparkles,
  admin: ShieldCheck,
  vitalicio: Star,
  curadoria: Clock,
  bloqueado: Lock,
  favorito: Star,
};

const TONES: Record<Tone, string> = {
  gold:
    "border-[var(--rule-gold-strong)] bg-[color-mix(in_oklab,var(--accent-ink)_8%,transparent)] text-[var(--accent-ink)]",
  "gold-filled":
    "border-transparent bg-[var(--accent-ink)] text-[var(--paper)]",
  neutral: "border-border/70 bg-background/80 text-foreground",
  muted: "border-border/60 bg-background/40 text-muted-foreground",
  info: "border-border/70 bg-background/80 text-[var(--state-info)]",
};

export function StatusBadge({
  kind,
  label,
  tone,
  className = "",
}: {
  kind?: keyof typeof ICONS;
  label: string;
  tone?: Tone;
  className?: string;
}) {
  const Icon = kind ? ICONS[kind] : null;
  const finalTone: Tone =
    tone ??
    (kind === "admin"
      ? "gold-filled"
      : kind === "pro" || kind === "vitalicio" || kind === "favorito"
        ? "gold"
        : kind === "bloqueado" || kind === "curadoria"
          ? "muted"
          : "neutral");
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${TONES[finalTone]} ${className}`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
}
