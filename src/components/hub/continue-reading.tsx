import { Link } from "@tanstack/react-router";
import { History, ArrowRight } from "lucide-react";
import { MULTI_LOGOS } from "@/lib/multi-logos";

type Item = { pais: string; nome: string; flag: string | null; lastAt: string };

export function ContinueReading({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <History className="h-3.5 w-3.5 text-muted-foreground" />
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Continuar de onde parou
        </h2>
      </div>
      <ul className="flex gap-2 overflow-x-auto pb-1">
        {items.map((it) => (
          <li key={it.pais} className="shrink-0">
            <Link
              to="/hub/$pais"
              params={{ pais: it.pais }}
              className="group flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-[0_4px_16px_-6px_rgba(0,0,0,0.12)]"
            >
              {it.flag ? (
                <img
                  src={`https://flagcdn.com/w40/${it.flag}.png`}
                  alt=""
                  width={24}
                  height={18}
                  className="rounded object-cover"
                  loading="lazy"
                />
              ) : MULTI_LOGOS[it.pais] ? (
                <img
                  src={MULTI_LOGOS[it.pais]}
                  alt=""
                  width={24}
                  height={18}
                  className="h-[18px] w-[24px] rounded bg-background object-contain ring-1 ring-border"
                  loading="lazy"
                />
              ) : (
                <span className="flex h-[18px] w-[24px] items-center justify-center rounded bg-secondary text-[8px] text-muted-foreground">
                  M
                </span>
              )}
              <span className="font-medium">{it.nome}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
