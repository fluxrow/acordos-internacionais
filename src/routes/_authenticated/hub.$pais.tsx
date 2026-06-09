import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Copy, Check, Search, Download, FileText } from "lucide-react";
import { getCountryHubData, type HubData } from "@/lib/hub.functions";
import { CTAButton } from "@/components/cta-button";
import { FavoritoButton } from "@/components/hub/favorito-button";
import { NotaEditor } from "@/components/hub/nota-editor";

const tabSchema = z.object({
  tab: z
    .enum(["visao", "documentos", "acordo", "ajuste"])
    .optional()
    .default("visao"),
});

export const Route = createFileRoute("/_authenticated/hub/$pais")({
  validateSearch: tabSchema,
  component: HubPaisPage,
});

function HubPaisPage() {
  const { pais } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const tab = search.tab;

  const { data, isPending, error } = useQuery<HubData>({
    queryKey: ["hub", pais],
    queryFn: () => getCountryHubData({ data: { pais } }),
  });

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center text-muted-foreground">
        Carregando materiais…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-muted-foreground">Acordo não encontrado.</p>
        <Link to="/hub" className="mt-4 inline-block text-sm underline">
          Voltar ao hub
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
      <header className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-display text-3xl md:text-4xl">{data.titulo}</h1>
          {!data.locked && <FavoritoButton pais={pais} />}
        </div>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-muted-foreground">
          <div>
            <dt className="inline text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">Instrumento </dt>
            <dd className="inline text-foreground">· {data.instrumento}</dd>
          </div>
          <div>
            <dt className="inline text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">Decreto </dt>
            <dd className="inline text-foreground">· {data.decreto}</dd>
          </div>
          <div>
            <dt className="inline text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">Vigor desde </dt>
            <dd className="inline text-foreground">· {data.vigorDesde}</dd>
          </div>
        </dl>
      </header>

      {data.locked ? (
        <LockedContent pais={pais} documentosPreview={data.documentosPreview} />
      ) : (
        <>
          <TabsBar
            current={tab}
            onChange={(t) => navigate({ search: { tab: t }, replace: true })}
          />
          <div className="mt-6">
            {tab === "visao" && (
              <div className="space-y-8">
                <VisaoTab data={data} />
                <NotaEditor pais={pais} />
              </div>
            )}
            {tab === "documentos" && <DocumentosTab data={data} />}
            {tab === "acordo" && <TextoIntegralTab slug={pais} kind="acordo" />}
            {tab === "ajuste" && <TextoIntegralTab slug={pais} kind="ajuste" />}
          </div>
        </>
      )}
    </div>
  );
}

const TABS = [
  { id: "visao", label: "Visão Geral" },
  { id: "documentos", label: "Documentos" },
  { id: "acordo", label: "Acordo (texto integral)" },
  { id: "ajuste", label: "Ajuste administrativo" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function TabsBar({
  current,
  onChange,
}: {
  current: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <div className="sticky top-12 z-20 -mx-5 border-b border-border/60 bg-[var(--surface-premium-strong)] px-5 backdrop-blur-md md:-mx-8 md:px-8">
      <nav className="flex gap-1 overflow-x-auto py-1">
        {TABS.map((t) => {
          const active = current === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`relative shrink-0 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                active
                  ? "font-medium text-[var(--accent-ink)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-x-2 -bottom-[5px] h-[2px] rounded-full bg-[var(--accent-ink)]"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

type Unlocked = Extract<HubData, { locked: false }>;

function VisaoTab({ data }: { data: Unlocked }) {
  return (
    <div className="space-y-8">
      <section>
        <p className="eyebrow mb-3">Benefícios cobertos</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <BeneficiosList titulo="Brasil" items={data.beneficios.brasil} />
          <BeneficiosList titulo="País parceiro" items={data.beneficios.parceiro} />
        </div>
      </section>

      {data.acordoTrecho && (
        <section>
          <p className="eyebrow mb-3">Trecho do acordo</p>
          <blockquote className="border-l-2 border-foreground pl-4 text-sm leading-relaxed text-muted-foreground">
            {data.acordoTrecho.slice(0, 280)}
            {data.acordoTrecho.length > 280 && "…"}
          </blockquote>
        </section>
      )}

      <div className="rounded-2xl border border-border/60 bg-background/60 px-6 py-5 backdrop-blur-md">
        <p className="text-sm font-medium">{data.documentos.length} documentos disponíveis</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Acesse a aba <strong>Documentos</strong> para baixar formulários, decretos e instruções.
        </p>
      </div>
    </div>
  );
}

function DocumentosTab({ data }: { data: Unlocked }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("todas");

  const categorias = useMemo(() => {
    const set = new Set(data.documentos.map((d) => d.cat));
    return ["todas", ...Array.from(set)];
  }, [data.documentos]);

  const filtrados = useMemo(() => {
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const query = norm(q);
    return data.documentos.filter((d) => {
      if (cat !== "todas" && d.cat !== cat) return false;
      if (!query) return true;
      return norm(d.nome).includes(query) || norm(d.desc).includes(query);
    });
  }, [data.documentos, q, cat]);

  if (data.documentos.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
        Sem documentos para este acordo.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar documento…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-foreground"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categorias.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                cat === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {c === "todas" ? "Todas" : c}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-2">
        {filtrados.map((doc) => (
          <li
            key={doc.arquivo || doc.nome}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_4px_16px_-6px_rgba(0,0,0,0.1)]"
          >
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{doc.nome}</p>
              <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="uppercase tracking-wider">{doc.cat}</span>
                {doc.tamanho && <span>· {doc.tamanho}</span>}
              </p>
            </div>
            {doc.url ? (
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-foreground px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] transition-colors hover:bg-foreground hover:text-background"
              >
                <Download className="h-3 w-3" />
                Baixar
              </a>
            ) : (
              <span className="shrink-0 text-xs text-muted-foreground">Indisponível</span>
            )}
          </li>
        ))}
      </ul>

      {filtrados.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Nenhum documento encontrado.
        </p>
      )}
    </div>
  );
}


function LockedContent({
  pais,
  documentosPreview,
}: {
  pais: string;
  documentosPreview: Array<{ nome: string; cat: string }>;
}) {
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-border/60 bg-background/60 px-6 py-5 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
        <p className="font-medium">Material técnico disponível para assinantes</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Assine o Hub Profissional e acesse o texto do acordo, decretos, formulários e modelos.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <CTAButton to="/precos" variant="dark" label="Ver planos" />
          <CTAButton to="/acordos/$pais" params={{ pais }} variant="light" label="Página pública" />
        </div>
      </div>

      {documentosPreview.length > 0 && (
        <div>
          <p className="eyebrow mb-3">Prévia dos materiais</p>
          <ul className="space-y-2">
            {documentosPreview.map((doc) => (
              <li
                key={doc.nome}
                className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-border text-[10px] font-medium uppercase">
                  {doc.cat.slice(0, 1)}
                </span>
                <span>{doc.nome}</span>
                <span className="ml-auto">🔒</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function OrgaoCard({
  titulo,
  orgao,
}: {
  titulo: string;
  orgao: {
    titulo?: string;
    instituicao?: string;
    endereco?: string;
    telefone?: string;
    email?: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <p className="eyebrow mb-2">{titulo}</p>
      {orgao.titulo && <p className="font-medium">{orgao.titulo}</p>}
      {orgao.instituicao && (
        <p className="mt-1 text-muted-foreground">{orgao.instituicao}</p>
      )}
      {orgao.endereco && (
        <p className="mt-2 text-xs text-muted-foreground">{orgao.endereco}</p>
      )}
      {orgao.telefone && (
        <p className="mt-1 text-xs text-muted-foreground">{orgao.telefone}</p>
      )}
      {orgao.email && (
        <a
          href={`mailto:${orgao.email}`}
          className="mt-2 block text-xs text-foreground underline underline-offset-4 hover:no-underline"
        >
          {orgao.email}
        </a>
      )}
    </div>
  );
}

function BeneficiosList({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{titulo}</p>
      <ul className="space-y-1">
        {items.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TextoIntegralTab({
  slug,
  kind,
}: {
  slug: string;
  kind: "acordo" | "ajuste";
}) {
  type Estado =
    | { kind: "loading" }
    | { kind: "loaded"; texto: string }
    | { kind: "error" };
  const [estado, setEstado] = useState<Estado>({ kind: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setEstado({ kind: "loading" });
    import(`../../data/acordos-textos/${slug}.ts`)
      .then((mod) => {
        if (cancelled) return;
        const texto: string = (kind === "acordo" ? mod.acordo : mod.ajuste) ?? "";
        setEstado({ kind: "loaded", texto });
      })
      .catch(() => {
        if (!cancelled) setEstado({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [slug, kind]);

  const label = kind === "acordo" ? "texto integral do acordo" : "ajuste administrativo";

  async function copy() {
    if (estado.kind !== "loaded" || !estado.texto) return;
    try {
      await navigator.clipboard.writeText(estado.texto);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <article className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">{label}</p>
        {estado.kind === "loaded" && estado.texto && (
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        )}
      </div>

      {estado.kind === "loading" && (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          Carregando texto…
        </p>
      )}

      {estado.kind === "error" && (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          Texto não disponível para este acordo.
        </p>
      )}

      {estado.kind === "loaded" && !estado.texto && (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          {kind === "ajuste"
            ? "Sem ajuste administrativo cadastrado para este acordo."
            : "Texto integral não disponível para este acordo."}
        </p>
      )}

      {estado.kind === "loaded" && estado.texto && (
        <div className="hub-surface overflow-hidden p-0">
          <pre className="hub-scroll max-h-[calc(100vh-260px)] min-h-[400px] overflow-y-auto overscroll-contain whitespace-pre-wrap p-6 font-sans text-[13px] leading-relaxed text-foreground/90">
            {estado.texto}
          </pre>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Conteúdo importado na íntegra do repositório oficial — nada foi alterado.
      </p>
    </article>
  );
}
