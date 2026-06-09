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
import { useSessionGuard } from "@/hooks/use-session-guard";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/theme-provider";



function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
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
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
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
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/46d4b385-b728-4144-a472-78583caf31a9/id-preview-78741ba4--76f6b88b-6d5f-448f-9e82-973d3ae6da41.lovable.app-1778844192909.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/46d4b385-b728-4144-a472-78583caf31a9/id-preview-78741ba4--76f6b88b-6d5f-448f-9e82-973d3ae6da41.lovable.app-1778844192909.png" },
      { title: "Acordos internacionais" },
      { property: "og:title", content: "Acordos internacionais" },
      { name: "twitter:title", content: "Acordos internacionais" },
      { name: "description", content: "International Agreements Hub: Your guide to international legal agreements and relocation." },
      { property: "og:description", content: "International Agreements Hub: Your guide to international legal agreements and relocation." },
      { name: "twitter:description", content: "International Agreements Hub: Your guide to international legal agreements and relocation." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://flagcdn.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@400;500;600;700&display=swap",
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
        {/* Anti-flash: aplica .light antes do primeiro paint se o usuário escolheu modo claro */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
  useSessionGuard();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}


