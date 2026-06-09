import { useQuery } from "@tanstack/react-query";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HubSidebar } from "@/components/hub/hub-sidebar";
import { HubTopbar } from "@/components/hub/hub-topbar";
import { getHubDashboard } from "@/lib/hub.functions";

/**
 * Chrome próprio do HUB (sidebar workstation + topbar curta).
 * Substitui o SiteHeader público em qualquer rota autenticada
 * (`/hub/*` e `/conta`). O SiteHeader é escondido em __root via
 * gate de pathname.
 *
 * A página `/hub/laudo` (visualização/print de PDF) renderiza
 * fora do shell para não vazar chrome dark no PDF.
 */
export function HubShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Print view do laudo fica fora do shell (segue forçada em .light dentro do componente).
  if (pathname.startsWith("/hub/laudo") && !pathname.startsWith("/hub/laudos")) {
    return <Outlet />;
  }

  const { data } = useQuery({
    queryKey: ["hub-dashboard"],
    queryFn: () => getHubDashboard(),
    staleTime: 60_000,
  });
  const isAdmin = data?.isAdmin === true;

  return (
    <SidebarProvider defaultOpen>
      <HubSidebar isAdmin={isAdmin} />
      <SidebarInset className="bg-background">
        <HubTopbar />
        <div className="flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
