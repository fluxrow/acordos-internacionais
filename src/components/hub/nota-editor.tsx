import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, NotebookPen } from "lucide-react";
import { getNota, saveNota } from "@/lib/hub-personal.functions";

export function NotaEditor({ pais }: { pais: string }) {
  const { data, isPending } = useQuery({
    queryKey: ["hub-nota", pais],
    queryFn: () => getNota({ data: { pais } }),
  });

  const [value, setValue] = useState<string>("");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (data && !hydrated.current) {
      setValue(data.conteudo);
      hydrated.current = true;
    }
  }, [data]);

  const m = useMutation({
    mutationFn: (conteudo: string) => saveNota({ data: { pais, conteudo } }),
    onSuccess: () => setSavedAt(Date.now()),
  });

  // Autosave 1.2s after typing stops
  useEffect(() => {
    if (!hydrated.current) return;
    if (value === (data?.conteudo ?? "")) return;
    const id = setTimeout(() => m.mutate(value), 1200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <section className="rounded-2xl border border-border bg-background p-5">
      <header className="flex items-center justify-between gap-3">
        <p className="eyebrow flex items-center gap-1.5">
          <NotebookPen className="h-3 w-3" /> Minhas anotações
        </p>
        <span className="text-[11px] text-muted-foreground">
          {m.isPending ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> salvando…
            </span>
          ) : savedAt ? (
            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3" /> salvo
            </span>
          ) : (
            "rascunho privado, só você vê"
          )}
        </span>
      </header>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
        rows={5}
        placeholder="Casos, decisões, contatos úteis, observações sobre este acordo…"
        className="mt-3 w-full resize-y rounded-lg border border-border bg-background p-3 text-sm leading-relaxed outline-none transition-colors focus:border-foreground"
        maxLength={5000}
      />
    </section>
  );
}
