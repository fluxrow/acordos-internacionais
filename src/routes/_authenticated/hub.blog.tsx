import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  listDraftBlogPosts,
  setBlogPostStatus,
  deleteBlogPost,
  listBlogTopics,
  generateBlogPostNow,
} from "@/lib/blog-admin.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/hub/blog")({
  component: HubBlogPage,
});

type Status = "all" | "draft" | "published" | "archived";

function HubBlogPage() {
  const router = useRouter();
  const listFn = useServerFn(listDraftBlogPosts);
  const setStatusFn = useServerFn(setBlogPostStatus);
  const deleteFn = useServerFn(deleteBlogPost);
  const topicsFn = useServerFn(listBlogTopics);
  const generateFn = useServerFn(generateBlogPostNow);
  const [filter, setFilter] = useState<Status>("all");

  const q = useQuery({
    queryKey: ["blog-admin", "list"],
    queryFn: () => listFn(),
  });

  const topicsQ = useQuery({
    queryKey: ["blog-admin", "topics"],
    queryFn: () => topicsFn(),
  });

  const generate = useMutation({
    mutationFn: (topicId?: string) =>
      generateFn({ data: topicId ? { topicId } : {} }),
    onSuccess: (res) => {
      toast.success(`Draft criado: ${res.titulo}`);
      q.refetch();
      topicsQ.refetch();
      router.navigate({ to: "/hub/blog/$slug", params: { slug: res.slug } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao gerar"),
  });


  const publish = useMutation({
    mutationFn: (slug: string) => setStatusFn({ data: { slug, status: "published" } }),
    onSuccess: () => {
      toast.success("Post publicado");
      q.refetch();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  const archive = useMutation({
    mutationFn: (slug: string) => setStatusFn({ data: { slug, status: "archived" } }),
    onSuccess: () => {
      toast.success("Arquivado");
      q.refetch();
    },
  });

  const reopen = useMutation({
    mutationFn: (slug: string) => setStatusFn({ data: { slug, status: "draft" } }),
    onSuccess: () => {
      toast.success("Voltou para rascunho");
      q.refetch();
    },
  });

  const remove = useMutation({
    mutationFn: (slug: string) => deleteFn({ data: { slug } }),
    onSuccess: () => {
      toast.success("Excluído");
      q.refetch();
    },
  });

  const posts = (q.data?.posts ?? []).filter(
    (p) => filter === "all" || p.status === filter,
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">
            <span className="text-gold">Blog</span> · gestão
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rascunhos gerados pela IA + artigos publicados. Você revisa antes
            de qualquer coisa ir ao ar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => generate.mutate(undefined)}
            disabled={generate.isPending}
          >
            {generate.isPending ? "Gerando... (~60s)" : "Gerar próxima da fila"}
          </Button>
          <Link to="/blog" target="_blank">
            <Button variant="outline">Ver blog público ↗</Button>
          </Link>
        </div>
      </header>

      {/* Pautas */}
      <section className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-foreground">Pautas na fila</h2>
            <p className="text-xs text-muted-foreground">
              Cada pauta vira um rascunho via Firecrawl + IA. Pode levar ~60s.
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => topicsQ.refetch()}
            disabled={topicsQ.isFetching}
          >
            {topicsQ.isFetching ? "..." : "Atualizar"}
          </Button>
        </div>
        {topicsQ.isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando pautas...</p>
        ) : (topicsQ.data?.topics?.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma pauta cadastrada.</p>
        ) : (
          <ul className="divide-y divide-border">
            {topicsQ.data!.topics.map((t: any) => {
              const used = !!t.usado_em;
              const inactive = !t.ativo;
              return (
                <li key={t.id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {inactive && (
                        <Badge variant="secondary" className="text-[10px]">inativa</Badge>
                      )}
                      {used && (
                        <Badge variant="outline" className="text-[10px]">
                          usada {new Date(t.usado_em).toLocaleDateString("pt-BR")}
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        prio {t.prioridade ?? 0}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-foreground">{t.titulo_sugerido}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generate.mutate(t.id)}
                    disabled={generate.isPending}
                  >
                    Gerar agora
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>


      <div className="flex flex-wrap gap-2">
        {(["all", "draft", "published", "archived"] as Status[]).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            onClick={() => setFilter(s)}
          >
            {s === "all"
              ? "Todos"
              : s === "draft"
                ? "Rascunhos"
                : s === "published"
                  ? "Publicados"
                  : "Arquivados"}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => q.refetch()}
          disabled={q.isFetching}
        >
          {q.isFetching ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>

      {q.isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhum post nesse filtro. Use a próxima etapa (botão "Gerar agora")
          para criar o primeiro rascunho.
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li
              key={p.slug}
              className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-hover)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString("pt-BR")}
                      {p.leitura_min ? ` · ${p.leitura_min} min` : ""}
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-lg text-foreground">
                    {p.titulo}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {p.resumo}
                  </p>
                  {Array.isArray(p.tags) && p.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.tags.slice(0, 5).map((t: string) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    to="/hub/blog/$slug"
                    params={{ slug: p.slug }}
                  >

                    <Button size="sm" variant="outline">
                      Abrir
                    </Button>
                  </Link>
                  {p.status === "draft" && (
                    <Button
                      size="sm"
                      onClick={() => publish.mutate(p.slug)}
                      disabled={publish.isPending}
                    >
                      Publicar
                    </Button>
                  )}
                  {p.status === "published" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => archive.mutate(p.slug)}
                      disabled={archive.isPending}
                    >
                      Arquivar
                    </Button>
                  )}
                  {(p.status === "archived" || p.status === "published") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => reopen.mutate(p.slug)}
                      disabled={reopen.isPending}
                    >
                      → Rascunho
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm(`Excluir "${p.titulo}"?`)) remove.mutate(p.slug);
                    }}
                    disabled={remove.isPending}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "Rascunho", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
    published: { label: "Publicado", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    archived: { label: "Arquivado", cls: "bg-muted text-muted-foreground border-border" },
  };
  const m = map[status] ?? { label: status, cls: "bg-muted" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${m.cls}`}>
      {m.label}
    </span>
  );
}
