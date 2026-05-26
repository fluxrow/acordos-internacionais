import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    // getSession() aguarda o restore do localStorage; evita race com OAuth callback
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
    // Revalida o JWT com o Auth server
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
