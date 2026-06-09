import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Calculator, FileText, Inbox, UserCircle2, Globe2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Item = {
  title: string;
  url: string;
  icon: typeof Home;
  match?: (path: string) => boolean;
};

const PRIMARY: Item[] = [
  {
    title: "Dashboard",
    url: "/hub",
    icon: Home,
    match: (p) => p === "/hub" || p === "/hub/",
  },
  {
    title: "Países",
    url: "/hub",
    icon: Globe2,
    match: (p) => p.startsWith("/hub/") && !!p.match(/^\/hub\/[^/]+$/) && !["/hub/calculadora", "/hub/laudos", "/hub/laudo", "/hub/leads"].includes(p),
  },
  {
    title: "Calculadora",
    url: "/hub/calculadora",
    icon: Calculator,
    match: (p) => p.startsWith("/hub/calculadora"),
  },
  {
    title: "Laudos",
    url: "/hub/laudos",
    icon: FileText,
    match: (p) => p.startsWith("/hub/laudo"),
  },
];

export function HubSidebar({ isAdmin }: { isAdmin: boolean }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (it: Item) =>
    it.match ? it.match(pathname) : pathname === it.url;

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 px-3 py-4">
        <Link
          to="/hub"
          className="flex items-center gap-2.5 px-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <span
            aria-hidden
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-ink)] text-[10px] font-bold tracking-tight text-[var(--paper)]"
          >
            AI
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm font-semibold text-foreground">
                Hub Pro
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Workstation
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY.map((it) => {
                const active = isActive(it);
                return (
                  <SidebarMenuItem key={it.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={it.title}
                      className={
                        active
                          ? "relative font-medium text-[var(--accent-ink)] before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[2px] before:-translate-y-1/2 before:rounded-r before:bg-[var(--accent-ink)] before:content-['']"
                          : ""
                      }
                    >
                      <Link to={it.url}>
                        <it.icon className={active ? "text-[var(--accent-ink)]" : ""} />
                        <span>{it.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/hub/leads")}
                    tooltip="Leads (admin)"
                    className={
                      pathname.startsWith("/hub/leads")
                        ? "relative font-medium text-[var(--accent-ink)] before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[2px] before:-translate-y-1/2 before:rounded-r before:bg-[var(--accent-ink)] before:content-['']"
                        : ""
                    }
                  >
                    <Link to="/hub/leads">
                      <Inbox />
                      <span>Leads</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/conta")}
              tooltip="Minha conta"
            >
              <Link to="/conta">
                <UserCircle2 />
                <span>Minha conta</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
