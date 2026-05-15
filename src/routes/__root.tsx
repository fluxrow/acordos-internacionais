import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="eyebrow">Erro 404</p>
          <h1 className="mt-4 font-display text-5xl">Página não encontrada</h1>
          <p className="mt-4 text-muted-foreground">
            O conteúdo que você procura pode ter sido movido ou ainda não existe.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-foreground px-5 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-foreground/85"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="eyebrow">Erro</p>
          <h1 className="mt-4 font-display text-3xl">Esta página não carregou</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Algo deu errado. Você pode tentar novamente ou voltar ao início.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="inline-flex items-center justify-center rounded-sm bg-foreground px-4 py-2 text-sm font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-foreground/85"
            >
              Tentar novamente
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-sm border border-foreground px-4 py-2 text-sm font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-secondary"
            >
              Início
            </a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

const SITE_TITLE =
  "Acordo Internacional — Acordos previdenciários para brasileiros no exterior";
const SITE_DESC =
  "Acordo Internacional reúne os acordos previdenciários bilaterais do Brasil, totalização de períodos e o hub profissional para advogados previdenciaristas.";
const OG_IMAGE = "https://acordo-internacional.lovable.app/og-image.jpg";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      { name: "author", content: "AtlasPrev" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Acordo Internacional" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", href: "/icon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://flagcdn.com" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://acordo-internacional.lovable.app/#organization",
              name: "Acordo Internacional",
              alternateName: "Acordo Internacional by AtlasPrev",
              url: "https://acordo-internacional.lovable.app",
              logo: {
                "@type": "ImageObject",
                url: "https://acordo-internacional.lovable.app/icon.png",
                width: 512,
                height: 512,
              },
              image: "https://acordo-internacional.lovable.app/og-image.jpg",
              description:
                "Plataforma de referência sobre os acordos previdenciários internacionais firmados pelo Brasil — totalização de períodos, benefícios e hub profissional para advogados.",
              slogan: "Acordos previdenciários do Brasil, sem juridiquês.",
              parentOrganization: {
                "@type": "Organization",
                name: "AtlasPrev",
              },
              knowsLanguage: ["pt-BR", "pt", "en", "es"],
              knowsAbout: [
                "Acordo internacional de previdência social",
                "Totalização de períodos contributivos",
                "Aposentadoria internacional",
                "INSS para brasileiros no exterior",
                "Certificado de Deslocamento Temporário",
                "Prova de vida no exterior",
                "Direito previdenciário internacional",
              ],
              areaServed: [
                { "@type": "Country", name: "Brasil" },
                { "@type": "Place", name: "Países com acordo previdenciário com o Brasil" },
              ],
              // sameAs: preencher com perfis oficiais quando disponíveis
              // (Instagram, LinkedIn AtlasPrev, YouTube, OAB, site institucional).
              sameAs: [],
            },
            {
              "@type": "WebSite",
              "@id": "https://acordo-internacional.lovable.app/#website",
              url: "https://acordo-internacional.lovable.app",
              name: "Acordo Internacional",
              description: SITE_DESC,
              inLanguage: "pt-BR",
              publisher: { "@id": "https://acordo-internacional.lovable.app/#organization" },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
