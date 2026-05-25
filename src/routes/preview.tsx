import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PreviewBanner } from "@/components/preview/preview-banner";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Pré-visualização · Briefing Dr. Marcos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewLayout,
});

function PreviewLayout() {
  return (
    <>
      <PreviewBanner />
      <Outlet />
    </>
  );
}
