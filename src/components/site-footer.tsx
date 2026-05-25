import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-semibold leading-tight text-foreground">
              Acordos Internacionais
            </p>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Acordos previdenciários bilaterais do Brasil, totalização de
              períodos contributivos e hub profissional para advogados
              previdenciaristas.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Cidadão</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/acordos" className="hover:underline underline-offset-4">
                  Países acordantes
                </Link>
              </li>
              <li>
                <Link
                  to="/jornadas/$jornada"
                  params={{ jornada: "moro-fora" }}
                  className="hover:underline underline-offset-4"
                >
                  Jornadas
                </Link>
              </li>
              <li>
                <Link
                  to="/guias/$slug"
                  params={{ slug: "totalizacao" }}
                  className="hover:underline underline-offset-4"
                >
                  Guias
                </Link>
              </li>
              <li>
                <Link to="/calculadora" className="hover:underline underline-offset-4">
                  Calculadora gratuita
                </Link>
              </li>
              <li>
                <Link to="/glossario" className="hover:underline underline-offset-4">
                  Glossário
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:underline underline-offset-4">
                  Falar com o Dr. Marcos Espínola
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Advogados</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profissional" className="hover:underline underline-offset-4">
                  Hub profissional
                </Link>
              </li>
              <li>
                <Link to="/precos" className="hover:underline underline-offset-4">
                  Planos e preços
                </Link>
              </li>
              <li>
                <Link to="/sobre/dr-marcos" className="hover:underline underline-offset-4">
                  Sobre o Dr. Marcos Espínola
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="rule mt-16" />

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Acordos Internacionais. Conteúdo
            informativo, não substitui orientação jurídica individualizada.
          </p>
          <p className="uppercase tracking-[0.18em]">
            Acordos Internacionais <span className="opacity-60">by</span> AtlasPrev
          </p>
        </div>
      </div>
    </footer>
  );
}
