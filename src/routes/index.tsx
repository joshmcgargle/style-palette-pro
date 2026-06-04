import { createFileRoute } from "@tanstack/react-router";
import { OutfitDesigner } from "@/components/OutfitDesigner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dressed — Outfit Designer" },
      { name: "description", content: "Mix hair, tops, bottoms, dresses, shoes, bags and jewelry into your perfect outfit." },
      { property: "og:title", content: "Dressed — Outfit Designer" },
      { property: "og:description", content: "Mix hair, tops, bottoms, dresses, shoes, bags and jewelry into your perfect outfit." },
    ],
  }),
  component: Index,
});

function Index() {
  return <OutfitDesigner />;
}
