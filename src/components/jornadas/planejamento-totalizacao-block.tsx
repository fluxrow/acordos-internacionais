import { Link } from "@tanstack/react-router";

export function PlanejamentoTotalizacaoBlock() {
  return (
    <section className="border-y border-[var(--accent-ink)]/30 bg-[var(--accent-ink-soft)]/40">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20 space-y-12">
        <header>
          <p className="eyebrow">Planejamento da totalização</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            Planejamento da totalização
          </h2>
          <p className="lede mt-4">
            Quanto mais cedo planeja, melhor. Objetivo: saber quanto vai
            receber, quando, e não deixar contribuições "na mesa".
          </p>
        </header>

        {/* ETAPA 1 — CDT vs CSDP */}
        <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
          <p className="eyebrow">Etapa 1</p>
          <h3 className="mt-2 font-display text-2xl">
            CDT × CSDP — qual é a minha situação?
          </h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--accent-ink)]/40 bg-background p-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                CDT · Deslocamento Temporário
              </p>
              <p className="mt-2 text-sm">
                Para quem vai trabalhar <strong>temporariamente</strong> no
                exterior — prazo varia conforme cada acordo bilateral.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <li>· Prova que você permanece vinculado à Previdência Brasileira</li>
                <li>· Evita dupla filiação</li>
                <li>· Garante que contribuições no exterior sejam totalizadas com o Brasil</li>
              </ul>
              <p className="mt-3 text-xs text-destructive">
                Sem CDT: risco de ser obrigado a contribuir também no país de destino.
              </p>
            </div>
            <div className="rounded-xl border border-destructive/40 bg-background p-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-destructive">
                CSDP · Comunicação de Saída Definitiva
              </p>
              <p className="mt-2 text-sm">
                Para quem vai ficar <strong>mais de 12 meses</strong> no exterior.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <li>· Comunicação à Receita Federal informando saída do Brasil</li>
                <li>· Evita dupla tributação</li>
                <li>· Você pode voltar quando quiser — não é permanente</li>
                <li>· Não impede receber benefícios do INSS depois</li>
              </ul>
            </div>
          </div>
        </article>

        {/* ETAPA 2 — manter contribuições */}
        <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
          <p className="eyebrow">Etapa 2</p>
          <h3 className="mt-2 font-display text-2xl">
            Manter contribuições ativas
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Decisão agora sobre contribuir afeta significativamente seu
            benefício futuro. Antes de decidir, você precisa saber:{" "}
            <strong>quanto</strong>, <strong>quando</strong>,{" "}
            <strong>onde</strong> e <strong>como</strong> vai receber.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Opção 1 · Facultativo no Brasil",
                d: "5% a 20% de um salário mínimo. Mantém o tempo no Brasil crescendo.",
              },
              {
                t: "Opção 2 · Só no país de residência",
                d: "Não paga Brasil. Tempo brasileiro fica parado, totalizado depois.",
              },
              {
                t: "Opção 3 · Em ambos",
                d: "Melhor aposentadoria futura, mas custo dobrado. Exige planejamento.",
              },
            ].map((opt) => (
              <div
                key={opt.t}
                className="rounded-xl border border-border bg-secondary/40 p-4"
              >
                <p className="text-sm font-medium">{opt.t}</p>
                <p className="mt-2 text-xs text-muted-foreground">{opt.d}</p>
              </div>
            ))}
          </div>

          <Link
            to="/calculadora"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-background hover:bg-foreground/85"
          >
            Abrir calculadora de totalização →
          </Link>
        </article>

        {/* ETAPA 3 — cenários */}
        <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
          <p className="eyebrow">Etapa 3</p>
          <h3 className="mt-2 font-display text-2xl">
            Analisar suas possibilidades
          </h3>
          <div className="mt-6 space-y-4">
            {[
              {
                titulo: "Cenário A · Voltarei ao Brasil em 5 anos",
                estrategia: "CDT (temporário) + facultativo no Brasil",
                resultado: "Maior tempo contribuído no Brasil ao retornar",
              },
              {
                titulo: "Cenário B · Fico fora indefinidamente (10+ anos)",
                estrategia: "CSDP + totalização ao final",
                resultado: "Aposentadoria em 1 ou 2 países",
              },
              {
                titulo: "Cenário C · Vou morar em 3 países diferentes",
                estrategia: "Totalização múltipla via acordos encadeados",
                resultado: "Planejamento complexo — exige especialista",
              },
            ].map((c) => (
              <div
                key={c.titulo}
                className="rounded-xl border border-border bg-secondary/40 p-4 text-sm"
              >
                <p className="font-medium">{c.titulo}</p>
                <p className="mt-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Estratégia:</span>{" "}
                  {c.estrategia}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Resultado:</span>{" "}
                  {c.resultado}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* ETAPA 4 — protocolar */}
        <article className="rounded-2xl border border-border bg-background p-6 md:p-8">
          <p className="eyebrow">Etapa 4</p>
          <h3 className="mt-2 font-display text-2xl">
            Protocolar a totalização no INSS
          </h3>
          <ol className="mt-6 space-y-3 text-sm text-muted-foreground">
            {[
              "Solicitação via Meu INSS ou presencialmente em uma APS",
              "INSS oficia o país acordante pedindo o tempo de contribuição",
              "País responde com o histórico contributivo",
              "INSS calcula a parte proporcional brasileira",
              "Aprovação e início do pagamento",
            ].map((p, i) => (
              <li key={p} className="flex gap-3">
                <span className="font-display text-base text-[var(--accent-ink)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-muted-foreground">
            Prazo total estimado: <strong>6 a 12 meses</strong>. Paciência
            necessária.
          </p>
        </article>

        {/* Erros comuns */}
        <article className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 md:p-8">
          <h3 className="font-display text-2xl">Erros comuns a evitar</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              ["Vou esperar a hora H", "Planejar agora, mesmo faltando anos"],
              ["Não contribuir porque é caro", "Calcular se vale a pena"],
              [
                "Deixar de contribuir no Brasil enquanto está fora",
                "Avaliar se facultativo é estratégico",
              ],
              [
                "Achar que tempo morando = tempo contábil",
                "Só tempo contribuído conta para totalização",
              ],
            ].map(([erro, certo]) => (
              <li key={erro} className="grid gap-1 sm:grid-cols-2">
                <span className="text-destructive">
                  <span aria-hidden>✗</span> {erro}
                </span>
                <span className="text-foreground">
                  <span aria-hidden>✓</span> {certo}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
