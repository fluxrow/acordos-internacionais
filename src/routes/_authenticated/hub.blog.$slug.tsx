import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  getBlogPostFull,
  updateBlogPostDraft,
  setBlogPostStatus,
  deleteBlogPost,
  renameBlogPostSlug,
} from "@/lib/blog-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/hub/blog/$slug")({
  component: HubBlogEditorPage,
});

type Bloco = { type: "p" | "h2"; text: string };

function HubBlogEditorPage() {
  const { slug } = Route.useParams();
  const router = useRouter();
  const getFn = useServerFn(getBlogPostFull);
  const updateFn = useServerFn(updateBlogPostDraft);
  const setStatusFn = useServerFn(setBlogPostStatus);
  const deleteFn = useServerFn(deleteBlogPost);
  const renameFn = useServerFn(renameBlogPostSlug);

  const q = useQuery({
    queryKey: ["blog-admin", "post", slug],
    queryFn: () => getFn({ data: { slug } }),
  });

  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [tags, setTags] = useState<string>("");
  const [leituraMin, setLeituraMin] = useState<number>(5);
  const [slugDraft, setSlugDraft] = useState("");

  useEffect(() => {
    const p = q.data?.post;
    if (!p) return;
    setTitulo(p.titulo ?? "");
    setResumo(p.resumo ?? "");
    setBlocos(Array.isArray(p.blocos) ? (p.blocos as Bloco[]) : []);
    setTags(Array.isArray(p.tags) ? (p.tags as string[]).join(", ") : "");
    setLeituraMin(typeof p.leitura_min === "number" ? p.leitura_min : 5);
    setSlugDraft(p.slug ?? "");
  }, [q.data]);

  const save = useMutation({
    mutationFn: () =>
      updateFn({
        data: {
          slug,
          titulo,
          resumo,
          blocos,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          leitura_min: leituraMin,
        },
      }),
    onSuccess: () => {
      toast.success("Rascunho salvo");
      q.refetch();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar"),
  });

  const publish = useMutation({
    mutationFn: async () => {
      await save.mutateAsync();
      return setStatusFn({ data: { slug, status: "published" } });
    },
    onSuccess: () => {
      toast.success("Post publicado");
      q.refetch();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao publicar"),
  });

  const archive = useMutation({
    mutationFn: () => setStatusFn({ data: { slug, status: "archived" } }),
    onSuccess: () => {
      toast.success("Arquivado");
      q.refetch();
    },
  });

  const remove = useMutation({
    mutationFn: () => deleteFn({ data: { slug } }),
    onSuccess: () => {
      toast.success("Excluído");
      router.navigate({ to: "/hub/blog" });
    },
  });

  const rename = useMutation({
    mutationFn: () => renameFn({ data: { currentSlug: slug, newSlug: slugDraft } }),
    onSuccess: (res) => {
      toast.success("Slug atualizado");
      router.navigate({ to: "/hub/blog/$slug", params: { slug: res.slug } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao renomear"),
  });

  if (q.isLoading) {
    return <div className="mx-auto max-w-4xl px-6 py-10 text-sm text-muted-foreground">Carregando...</div>;
  }
  if (!q.data?.post) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-4">
        <p className="text-sm text-muted-foreground">Post não encontrado.</p>
        <Link to="/hub/blog">
          <Button variant="outline">← Voltar</Button>
        </Link>
      </div>
    );
  }

  const post = q.data.post;
  const updateBloco = (i: number, patch: Partial<Bloco>) =>
    setBlocos((bs) => bs.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  const moveBloco = (i: number, dir: -1 | 1) =>
    setBlocos((bs) => {
      const next = [...bs];
      const j = i + dir;
      if (j < 0 || j >= next.length) return bs;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const removeBloco = (i: number) => setBlocos((bs) => bs.filter((_, idx) => idx !== i));
  const addBloco = (type: "p" | "h2") => setBlocos((bs) => [...bs, { type, text: "" }]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/hub/blog">
          <Button variant="ghost" size="sm">← Voltar</Button>
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => save.mutate()}
            disabled={save.isPending}
          >
            {save.isPending ? "Salvando..." : "Salvar rascunho"}
          </Button>
          {post.status !== "published" && (
            <Button onClick={() => publish.mutate()} disabled={publish.isPending}>
              {publish.isPending ? "Publicando..." : "Salvar e publicar"}
            </Button>
          )}
          {post.status === "published" && (
            <Button variant="outline" onClick={() => archive.mutate()} disabled={archive.isPending}>
              Arquivar
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-destructive"
            onClick={() => {
              if (confirm(`Excluir "${post.titulo}"?`)) remove.mutate();
            }}
          >
            Excluir
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <Label>Slug</Label>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{post.slug}</p>
        </div>
        <div>
          <Label htmlFor="titulo">Título</Label>
          <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="resumo">Resumo</Label>
          <Textarea id="resumo" rows={3} value={resumo} onChange={(e) => setResumo(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="leitura">Leitura (min)</Label>
            <Input
              id="leitura"
              type="number"
              min={1}
              max={60}
              value={leituraMin}
              onChange={(e) => setLeituraMin(parseInt(e.target.value, 10) || 1)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-foreground">Blocos</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => addBloco("h2")}>
              + H2
            </Button>
            <Button size="sm" variant="outline" onClick={() => addBloco("p")}>
              + Parágrafo
            </Button>
          </div>
        </div>
        {blocos.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum bloco. Adicione acima.</p>
        )}
        {blocos.map((b, i) => (
          <div key={i} className="rounded-lg border border-border bg-background/40 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {b.type === "h2" ? "Subtítulo (H2)" : "Parágrafo"}
              </span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => moveBloco(i, -1)}>↑</Button>
                <Button size="sm" variant="ghost" onClick={() => moveBloco(i, 1)}>↓</Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => removeBloco(i)}
                >
                  ×
                </Button>
              </div>
            </div>
            {b.type === "h2" ? (
              <Input
                value={b.text}
                onChange={(e) => updateBloco(i, { text: e.target.value })}
                placeholder="Subtítulo da seção"
              />
            ) : (
              <Textarea
                rows={4}
                value={b.text}
                onChange={(e) => updateBloco(i, { text: e.target.value })}
                placeholder="Texto do parágrafo"
              />
            )}
          </div>
        ))}
      </div>

      {Array.isArray(post.fontes) && post.fontes.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg text-foreground">Fontes consultadas</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {(post.fontes as Array<{ url: string; titulo?: string }>).map((f, i) => (
              <li key={i}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  {f.titulo ?? f.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
