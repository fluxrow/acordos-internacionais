import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "dark" | "light" | "solid-light" | "ghost-light";
type Size = "md" | "lg";

interface CommonProps {
  label: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

type LinkProps = CommonProps & {
  to: ComponentProps<typeof Link>["to"];
  params?: Record<string, string>;
  href?: never;
  onClick?: never;
};

type AnchorProps = CommonProps & {
  href: string;
  to?: never;
  params?: never;
  onClick?: never;
};

type ButtonProps = CommonProps & {
  onClick: () => void;
  to?: never;
  params?: never;
  href?: never;
};

type CTAButtonProps = LinkProps | AnchorProps | ButtonProps;

const sizes: Record<Size, { wrap: string; circle: string; pad: string }> = {
  md: {
    wrap: "h-12 pl-1.5 pr-6",
    circle: "h-9 w-9",
    pad: "pl-12",
  },
  lg: {
    wrap: "h-14 pl-2 pr-7",
    circle: "h-10 w-10",
    pad: "pl-14",
  },
};

export function CTAButton(props: CTAButtonProps) {
  const { label, variant = "dark", size = "md", className } = props;
  const s = sizes[size];

  // Premium Dark + Gold — todas as variantes convivem em fundo escuro.
  // Primary (dark, solid-light) : pill gold com texto preto.
  // Secondary (light, ghost-light): pill outline gold com texto gold.
  const styles: Record<Variant, { wrap: string; circle: string }> = {
    dark: {
      wrap: "border-[var(--accent-ink)] bg-[var(--accent-ink)] text-[var(--paper)] hover:text-[var(--accent-ink)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-gold-glow)]",
      circle: "bg-[var(--paper)]",
    },
    light: {
      wrap: "border-[var(--accent-ink)] bg-transparent text-[var(--accent-ink)] hover:text-[var(--paper)] hover:shadow-[var(--shadow-gold-glow)]",
      circle: "bg-[var(--accent-ink)]",
    },
    "solid-light": {
      wrap: "border-[var(--accent-ink)] bg-[var(--accent-ink)] text-[var(--paper)] hover:text-[var(--accent-ink)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-gold-glow)]",
      circle: "bg-[var(--paper)]",
    },
    "ghost-light": {
      wrap: "border-[var(--accent-ink)] bg-transparent text-[var(--accent-ink)] hover:text-[var(--paper)] hover:shadow-[var(--shadow-gold-glow)]",
      circle: "bg-[var(--accent-ink)]",
    },
  };

  const base = cn(
    "group relative inline-flex items-center overflow-hidden rounded-full border transition-all duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5",
    s.wrap,
    s.pad,
    styles[variant].wrap,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className,
  );


  const circleColor = styles[variant].circle;

  const content = (
    <>
      {/* círculo expansível */}
      <span
        aria-hidden
        className={cn(
          "absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full origin-left transition-transform duration-500 ease-out group-hover:scale-x-[18] group-hover:scale-y-[4] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          s.circle,
          circleColor,
        )}
      />
      {/* label */}
      <span className="relative z-10 text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 ease-out motion-reduce:transition-none">
        {label}
      </span>
      {/* seta */}
      <ArrowRight
        aria-hidden
        className="relative z-10 ml-auto h-4 w-4 -translate-x-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:translate-x-0 motion-reduce:opacity-100"
      />
    </>
  );

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} params={props.params as never} className={base}>
        {content}
      </Link>
    );
  }
  if ("href" in props && props.href) {
    return (
      <a href={props.href} className={base}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={(props as ButtonProps).onClick} className={base}>
      {content}
    </button>
  );
}

export default CTAButton;
