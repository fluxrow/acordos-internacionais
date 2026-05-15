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
  "Acordos Internacionais de Previdência Social | Brasil";
const SITE_DESC =
  "Hub de referência sobre os acordos previdenciários internacionais do Brasil. Conteúdo claro para o cidadão e base técnica para advogados previdenciaristas.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      { name: "author", content: "Acordos Internacionais" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Acordos Internacionais" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
      { title: "Lovable App" },
      { property: "og:title", content: "Lovable App" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "description", content: "International Agreements Hub: Your guide to international legal agreements and relocation." },
      { property: "og:description", content: "International Agreements Hub: Your guide to international legal agreements and relocation." },
      { name: "twitter:description", content: "International Agreements Hub: Your guide to international legal agreements and relocation." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/46d4b385-b728-4144-a472-78583caf31a9/id-preview-78741ba4--76f6b88b-6d5f-448f-9e82-973d3ae6da41.lovable.app-1778844192909.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/46d4b385-b728-4144-a472-78583caf31a9/id-preview-78741ba4--76f6b88b-6d5f-448f-9e82-973d3ae6da41.lovable.app-1778844192909.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://flagcdn.com" },
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
