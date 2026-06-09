import type { ReactNode } from "react";

/**
 * Superfície premium reutilizável do HUB.
 * Use em todos os blocos de conteúdo dentro do workstation chrome.
 */
export function SectionCard({
  children,
  className = "",
  as: As = "section",
  hover = false,
  gold = false,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  as?: keyof Pick<JSX.IntrinsicElements, "section" | "div" | "article" | "aside">;
  hover?: boolean;
  gold?: boolean;
  padded?: boolean;
}) {
  return (
    <As
      className={[
        "hub-surface",
        padded ? "p-5" : "",
        hover ? "card-hover" : "",
        gold ? "hub-rule-gold" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </As>
  );
}
