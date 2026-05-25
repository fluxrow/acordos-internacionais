import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { listFavoritos, toggleFavorito } from "@/lib/hub-personal.functions";

export function FavoritoButton({ pais }: { pais: string }) {
  const qc = useQueryClient();
  const { data: favs } = useQuery({
    queryKey: ["hub-favoritos"],
    queryFn: () => listFavoritos(),
  });
  const isFav = (favs ?? []).includes(pais);

  const m = useMutation({
    mutationFn: () => toggleFavorito({ data: { pais } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hub-favoritos"] }),
  });

  return (
    <button
      type="button"
      onClick={() => m.mutate()}
      disabled={m.isPending}
      aria-pressed={isFav}
      aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
        isFav
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
    >
      <Star className={`h-3 w-3 ${isFav ? "fill-current" : ""}`} />
      {isFav ? "Favorito" : "Favoritar"}
    </button>
  );
}
