import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { CTAButton } from "@/components/cta-button";
import type { ReactNode } from "react";

type Caso = 1 | 2 | "2B" | 3;

interface CTAMarcosProps {
  variant?: "card" | "block" | "result";
  contexto?: string;
  caso?: Caso;
}

function headlineFor(caso?: Caso): ReactNode {
  switch (caso) {
    case 1:
      return (
        <>
          Você já tem <strong>direito no Brasil</strong>. Vamos garantir o{" "}
          <strong>melhor valor</strong>.
        </>
      );
    case 2:
      return (
        <>
          Ainda não dá hoje — mas <strong>um planejamento muda esse cenário</strong>.
        </>
      );
    case "2B":
      return (
        <>
          Falta só a idade. <strong>Cada mês conta</strong> para você se aposentar melhor.
        </>
      );
    case 3:
      return (
        <>
          Você tem direito à <strong>totalização internacional</strong>. Vamos protocolar.
        </>
      );
    default:
      return (
        <>
          Transforme seu cálculo em um <strong>planejamento real</strong>.
        </>
      );
  }
}

export function CTAMarcos({ variant = "card", contexto, caso }: CTAMarcosProps) {
  if (variant === "result") {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-[var(--accent-ink)]/30 bg-[var(--accent-ink-soft)] p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,_color-mix(in_oklab,_var(--accent-ink)_22%,_transparent)_0%,_transparent_55%)]"
        />
        <div className="relative z-10">
          <p className="eyebrow text-[var(--accent-ink)]">Próximo passo</p>
          <h3 className="mt-3 font-display text-2xl leading-tight text-[var(--accent-ink)] md:text-3xl">
            {headlineFor(caso)}
          </h3>
          {contexto && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80 md:text-base">
              {contexto}
            </p>
          )}

          <ul className="mt-5 grid gap-2 sm:grid-cols-3">
            {[
              "Análise do seu caso",
              "Estratégia personalizada",
              "Atendimento com o Dr. Marcos",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-foreground/85"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-ink)] text-background">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <CTAButton
              to="/contato"
              variant="dark"
              size="lg"
              label="Quero fazer meu planejamento"
            />
            <Link
              to="/contato"
              className="text-sm text-[var(--accent-ink)] underline underline-offset-4 hover:opacity-80"
            >
              Prefiro saber mais antes →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "block") {
    return (
      <section className="relative overflow-hidden border-y border-[var(--accent-ink)]/20 bg-[var(--accent-ink-soft)] py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_color-mix(in_oklab,_var(--accent-ink)_18%,_transparent)_0%,_transparent_60%)]"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow">Atendimento direto</p>
          <h2 className="mt-3 font-display text-3xl">
            Precisa de orientação no seu caso?
          </h2>
          <p className="lede mx-auto mt-4 max-w-xl">
            {contexto ??
              "O Dr. Marcos Espínola é especialista em acordos internacionais de previdência. Conte sua situação e receba um retorno qualificado."}
          </p>
          <div className="mt-8 flex justify-center">
            <CTAButton to="/contato" variant="dark" label="Falar com o Dr. Marcos" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <aside className="rounded-2xl border border-border/60 bg-background/60 p-6 backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(122,31,31,0.12)]">
      <p className="eyebrow">Atendimento direto</p>
      <p className="mt-2 font-display text-xl leading-tight">
        Dúvidas no seu caso?
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {contexto ?? "Fale com o Dr. Marcos Espínola, advogado responsável."}
      </p>
      <Link
        to="/contato"
        className="mt-4 inline-block text-sm underline underline-offset-4 hover:text-destructive"
      >
        Iniciar contato →
      </Link>
    </aside>
  );
}
