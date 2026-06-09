import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HubSidebar } from "@/components/hub/hub-sidebar";
import { HubTopbar } from "@/components/hub/hub-topbar";
import { getHubDashboard } from "@/lib/hub.functions";

/**
 * Chrome próprio do HUB (sidebar workstation + topbar curta).
 *
 * Sidebar começa colapsada (modo ícone) e expande ao passar o mouse —
 * recolhe automaticamente quando o ponteiro sai. Em mobile o comportamento
 * padrão (sheet) é preservado.
 */
export function HubShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname.startsWith("/hub/laudo") && !pathname.startsWith("/hub/laudos")) {
    return <Outlet />;
  }

  const { data } = useQuery({
    queryKey: ["hub-dashboard"],
    queryFn: () => getHubDashboard(),
    staleTime: 60_000,
  });
  const isAdmin = data?.isAdmin === true;

  // Hover-to-expand: começa recolhida e expande enquanto o mouse está sobre a sidebar.
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} defaultOpen={false}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="contents"
      >
        <HubSidebar isAdmin={isAdmin} />
      </div>
      <SidebarInset className="bg-background">
        <HubTopbar />
        <div className="flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
