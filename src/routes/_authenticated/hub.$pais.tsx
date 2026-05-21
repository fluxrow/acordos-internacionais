import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCountryHubData, type HubData } from "@/lib/hub.functions";
import { CTAButton } from "@/components/cta-button";

export const Route = createFileRoute("/_authenticated/hub/$pais")({
  component: HubPaisPage,
});

function HubPaisPage() {
  const { pais } = Route.useParams();

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
    <div className="mx-auto max-w-4xl px-6 py-10">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/hub" className="hover:text-foreground">Hub</Link>
        <span className="mx-2">›</span>
        <span>{data.titulo}</span>
      </nav>

      <h1 className="font-display text-4xl">{data.titulo}</h1>

      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-sm text-muted-foreground">
        <div>
          <dt className="inline font-medium text-foreground">Instrumento: </dt>
          <dd className="inline">{data.instrumento}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">Decreto: </dt>
          <dd className="inline">{data.decreto}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">Vigor desde: </dt>
          <dd className="inline">{data.vigorDesde}</dd>
        </div>
      </dl>

      {data.locked ? (
        <LockedContent pais={pais} documentosPreview={data.documentosPreview} />
      ) : (
        <UnlockedContent data={data} />
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
      <div className="rounded-2xl border border-border bg-secondary px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
        <p className="font-medium">Material técnico disponível para assinantes</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Assine o Hub Profissional e acesse o texto do acordo, decretos, formulários e modelos.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <CTAButton to="/precos" variant="dark" label="Ver planos" />
          <CTAButton
            to="/acordos/$pais"
            params={{ pais }}
            variant="light"
            label="Página pública"
          />
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

function UnlockedContent({ data }: { data: Extract<HubData, { locked: false }> }) {
  return (
    <div className="mt-8 space-y-8">
      {data.acordoTrecho && (
        <section>
          <p className="eyebrow mb-3">Trecho do acordo</p>
          <blockquote className="border-l-2 border-foreground pl-4 text-sm leading-relaxed text-muted-foreground">
            {data.acordoTrecho}
          </blockquote>
        </section>
      )}

      <section className="grid gap-6 sm:grid-cols-2">
        {data.orgaoBR && (
          <OrgaoCard titulo="Órgão de Ligação (Brasil)" orgao={data.orgaoBR} />
        )}
        {data.orgaoParceiro && (
          <OrgaoCard titulo="Órgão de Ligação (Parceiro)" orgao={data.orgaoParceiro} />
        )}
      </section>

      <section>
        <p className="eyebrow mb-3">Benefícios cobertos</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <BeneficiosList titulo="Brasil" items={data.beneficios.brasil} />
          <BeneficiosList titulo="País parceiro" items={data.beneficios.parceiro} />
        </div>
      </section>

      {data.documentos.length > 0 && (
        <section>
          <p className="eyebrow mb-3">Materiais disponíveis</p>
          <ul className="space-y-2">
            {data.documentos.map((doc) => (
              <li
                key={doc.arquivo || doc.nome}
                className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_4px_16px_-6px_rgba(0,0,0,0.1)]"
              >
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-secondary px-1.5 text-[10px] font-medium uppercase">
                  {doc.cat.slice(0, 3)}
                </span>
                <span className="flex-1 truncate">{doc.nome}</span>
                {doc.tamanho && (
                  <span className="text-xs text-muted-foreground">{doc.tamanho}</span>
                )}
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 shrink-0 rounded-full border border-foreground px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] transition-colors hover:bg-foreground hover:text-background"
                  >
                    Baixar
                  </a>
                ) : (
                  <span className="ml-2 text-xs text-muted-foreground">Indisponível</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function OrgaoCard({
  titulo,
  orgao,
}: {
  titulo: string;
  orgao: { titulo?: string; instituicao?: string; endereco?: string; telefone?: string; email?: string };
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <p className="eyebrow mb-2">{titulo}</p>
      {orgao.titulo && <p className="font-medium">{orgao.titulo}</p>}
      {orgao.instituicao && <p className="mt-1 text-muted-foreground">{orgao.instituicao}</p>}
      {orgao.endereco && <p className="mt-1 text-xs text-muted-foreground">{orgao.endereco}</p>}
      {orgao.email && (
        <a href={`mailto:${orgao.email}`} className="mt-1 block text-xs hover:underline">
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
