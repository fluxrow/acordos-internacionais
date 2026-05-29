import { useState } from "react";
import { ChevronDown, User, Scale } from "lucide-react";
import {
  detectarCenarios,
  type Cenario,
  type CenarioInputs,
} from "@/lib/calculadora-cenarios";
import type { ResultadoCalculo } from "@/lib/calculadora";

type Variant = "publico" | "advogado";

interface Props {
  resultado: ResultadoCalculo;
  inputs: CenarioInputs;
  variant: Variant;
}

export function CenariosBlock({ resultado, inputs, variant }: Props) {
  const cenarios = detectarCenarios(resultado, inputs);
  if (cenarios.length === 0) return null;

  return (
    <section className="mt-8 space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent-ink)]">
          Análise estratégica
        </p>
        <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
          O que esse resultado <span className="text-gold">significa</span> na prática
        </h3>
        <p className="text-sm text-[var(--ink-soft)]">
          {variant === "advogado"
            ? "Visão do segurado (linguagem leiga) e do advogado (técnica com citações), no padrão do laudo do Dr. Marcos."
            : "Veja o seu cenário em duas camadas: a linguagem do dia a dia e a análise técnica que o Dr. Marcos faria sobre o caso."}
        </p>
      </header>

      <div className="space-y-3">
        {cenarios.map((c) => (
          <CenarioCard key={c.id} cenario={c} defaultOpen={cenarios.length === 1} />
        ))}
      </div>
    </section>
  );
}

function CenarioCard({ cenario, defaultOpen }: { cenario: Cenario; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-soft-hover)] print:break-inside-avoid print:shadow-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left print:cursor-default"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--accent-ink)] px-2 text-[11px] font-semibold tracking-wide text-[var(--paper)]">
            {cenario.id}
          </span>
          <div>
            <h4 className="font-display text-base font-semibold text-[var(--ink)]">
              {cenario.titulo}
            </h4>
            <p className="mt-0.5 text-xs text-[var(--ink-soft)]">{cenario.subtitulo}</p>
          </div>
        </div>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-[var(--ink-soft)] transition-transform print:hidden ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      <div
        className={`grid gap-4 border-t border-[var(--border)] px-5 py-5 md:grid-cols-2 ${
          open ? "" : "hidden print:grid"
        }`}
      >
        <PainelSegurado texto={cenario.segurado} />
        <PainelAdvogado
          chamada={cenario.advogado.chamada}
          bullets={cenario.advogado.bullets}
          citacoes={cenario.citacoes}
        />
      </div>
    </article>
  );
}

function PainelSegurado({ texto }: { texto: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--paper-soft)] p-4">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
        <User className="h-3.5 w-3.5" aria-hidden strokeWidth={1.8} />
        Segurado vê
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]">{texto}</p>
    </div>
  );
}

function PainelAdvogado({
  chamada,
  bullets,
  citacoes,
}: {
  chamada: string;
  bullets: string[];
  citacoes: string[];
}) {
  return (
    <div className="rounded-xl border border-[color-mix(in_oklab,var(--accent-ink)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent-ink)_8%,var(--card-bg))] p-4">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
        <Scale className="h-3.5 w-3.5" aria-hidden strokeWidth={1.8} />
        Advogado vê
      </p>
      <p className="mt-3 text-sm font-semibold leading-snug text-gold">{chamada}</p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--ink)]">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent-ink)]" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {citacoes.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {citacoes.map((c) => (
            <span
              key={c}
              className="inline-flex items-center rounded-full border border-[color-mix(in_oklab,var(--accent-ink)_40%,transparent)] bg-[var(--card-bg)] px-2.5 py-0.5 text-[11px] text-[var(--ink-soft)]"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
