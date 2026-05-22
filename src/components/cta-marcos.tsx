import { Link } from "@tanstack/react-router";
import { CTAButton } from "@/components/cta-button";

interface CTAMarcosProps {
  variant?: "card" | "block";
  contexto?: string;
}

export function CTAMarcos({ variant = "card", contexto }: CTAMarcosProps) {
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
    <aside className="border border-border bg-secondary p-6">
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
