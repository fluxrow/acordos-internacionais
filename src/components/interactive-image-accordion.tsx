import { useState } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  alt: string;
};

interface InteractiveImageAccordionProps {
  items: AccordionItem[];
}

export function InteractiveImageAccordion({ items }: InteractiveImageAccordionProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  return (
    <div className="flex w-full flex-col gap-3 md:h-[480px] md:flex-row md:gap-2">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            aria-expanded={isActive}
            aria-label={item.titulo}
            onMouseEnter={() => setActiveId(item.id)}
            onFocus={() => setActiveId(item.id)}
            onClick={() => setActiveId(item.id)}
            className={cn(
              "group relative overflow-hidden border border-border bg-secondary text-left transition-all duration-500 ease-in-out cursor-pointer",
              // Mobile: cada card aberto curto
              "h-56 w-full",
              // Desktop: largura flexiva
              "md:h-full",
              isActive ? "md:flex-[5]" : "md:flex-[1]",
            )}
          >
            {/* Imagem de fundo */}
            <img
              src={item.imagem}
              alt={item.alt}
              loading="lazy"
              width={1024}
              height={1280}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out",
                isActive ? "scale-100 opacity-100" : "scale-110 opacity-60 md:opacity-40",
              )}
            />

            {/* Overlay escuro wine */}
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                isActive
                  ? "bg-[linear-gradient(180deg,_color-mix(in_oklab,_var(--accent-ink)_55%,_transparent)_0%,_color-mix(in_oklab,_var(--accent-ink)_85%,_transparent)_100%)]"
                  : "bg-[color-mix(in_oklab,_var(--accent-ink)_75%,_transparent)]",
              )}
            />

            {/* Conteúdo colapsado: título vertical (apenas desktop, quando inativo) */}
            <div
              className={cn(
                "absolute inset-0 hidden items-end justify-center p-4 transition-opacity duration-300 md:flex",
                isActive ? "opacity-0" : "opacity-100",
              )}
            >
              <span
                className="font-display text-base tracking-wide text-[var(--paper)] [writing-mode:vertical-rl] [transform:rotate(180deg)]"
              >
                {item.titulo}
              </span>
            </div>

            {/* Conteúdo expandido */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-end p-6 md:p-8 transition-opacity duration-500",
                isActive ? "opacity-100" : "opacity-100 md:opacity-0",
              )}
            >
              <p className="eyebrow text-[var(--paper)]/80">Área de atuação</p>
              <h3 className="mt-2 font-display text-2xl leading-tight text-[var(--paper)] md:text-3xl">
                {item.titulo}
              </h3>
              <p
                className={cn(
                  "mt-3 max-w-md text-sm leading-relaxed text-[var(--paper)]/90 md:text-base transition-all duration-500",
                  isActive
                    ? "md:translate-y-0 md:opacity-100"
                    : "md:translate-y-2 md:opacity-0",
                )}
              >
                {item.descricao}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
