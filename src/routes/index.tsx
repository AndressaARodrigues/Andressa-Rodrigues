import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "@/components/desktop/Desktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alex Placeholder — Desktop Portfolio" },
      {
        name: "description",
        content:
          "An interactive macOS-inspired desktop portfolio. Open apps, browse folders, and discover hidden commands in the terminal.",
      },
      { property: "og:title", content: "Alex Placeholder — Desktop Portfolio" },
      {
        property: "og:description",
        content:
          "An interactive macOS-inspired desktop portfolio. Open apps, browse folders, and discover hidden commands in the terminal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Desktop />;
}
