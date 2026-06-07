import { createFileRoute } from "@tanstack/react-router";
import { refreshShop } from "@/lib/products.functions";

export const Route = createFileRoute("/api/public/admin/seed-shop")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { url: string; shop: string; cat: string };
        try {
          const res = await refreshShop({ data: body });
          return Response.json({ ok: true, ...res });
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : String(e) },
            { status: 500 },
          );
        }
      },
    },
  },
});