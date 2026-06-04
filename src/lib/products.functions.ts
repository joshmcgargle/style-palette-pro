import { createServerFn } from "@tanstack/react-start";

export type DBProduct = {
  id: string;
  cat: string;
  shop: string;
  shopUrl: string;
  name: string;
  price: string;
  img: string;
  url: string;
};

function absoluteUrl(maybe: string | undefined, base: string): string {
  if (!maybe) return base;
  try { return new URL(maybe, base).toString(); } catch { return base; }
}

function normalizePrice(p: string | number | undefined): string {
  if (p == null) return "";
  if (typeof p === "number") return `$${p.toFixed(0)}`;
  return String(p).trim();
}

function validateProductUrl(productUrl: string, fallback: string): string {
  if (!productUrl) return fallback;
  try {
    const u = new URL(productUrl);
    const path = u.pathname.toLowerCase();
    if (/\.(jpe?g|png|webp|gif|svg|avif)(\?|$)/.test(path)) return fallback;
    if (/(images?|media|cdn|static|assets)\./i.test(u.hostname)) return fallback;
    return u.toString();
  } catch { return fallback; }
}

function buildPageVariants(baseUrl: string): string[] {
  const variants = new Set<string>([baseUrl]);
  try {
    const u = new URL(baseUrl);
    for (const name of ["page", "pageNumber", "pgno", "start"]) {
      const v = new URL(u.toString());
      v.searchParams.set(name, "2");
      variants.add(v.toString());
    }
    const v2 = new URL(u.toString());
    v2.searchParams.set("page", "3");
    variants.add(v2.toString());
  } catch { /* ignore */ }
  return Array.from(variants).slice(0, 5);
}

export const getProducts = createServerFn({ method: "POST" })
  .inputValidator((data: { cat: string; shop: string }) => {
    if (!data?.cat || !data?.shop) throw new Error("cat and shop required");
    return data;
  })
  .handler(async ({ data }): Promise<{ products: DBProduct[] }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("id, cat, shop, shop_url, name, price, img, url")
      .eq("cat", data.cat)
      .eq("shop", data.shop)
      .order("scraped_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    const products: DBProduct[] = (rows ?? []).map((r) => ({
      id: r.id,
      cat: r.cat,
      shop: r.shop,
      shopUrl: r.shop_url,
      name: r.name,
      price: r.price ?? "",
      img: r.img,
      url: r.url,
    }));
    return { products };
  });

export const refreshShop = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string; shop: string; cat: string }) => {
    if (!data?.url || !/^https?:\/\//i.test(data.url)) throw new Error("Invalid URL");
    if (!data.shop || !data.cat) throw new Error("shop and cat required");
    return data;
  })
  .handler(async ({ data }): Promise<{ inserted: number; pages: number }> => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY not configured");

    const schema = {
      type: "object",
      properties: {
        products: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              price: { type: "string" },
              image: { type: "string" },
              url: { type: "string" },
            },
            required: ["name", "image"],
          },
        },
      },
      required: ["products"],
    };

    async function scrapeOnce(pageUrl: string) {
      const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          url: pageUrl,
          formats: [{
            type: "json",
            schema,
            prompt: "Extract every product listing on this category page. For each: name, displayed price with currency, absolute image URL, and absolute product page URL (not the image URL). Skip ads and navigation.",
          }],
          onlyMainContent: true,
          waitFor: 4000,
          actions: [
            { type: "scroll", direction: "down" }, { type: "wait", milliseconds: 800 },
            { type: "scroll", direction: "down" }, { type: "wait", milliseconds: 800 },
            { type: "scroll", direction: "down" }, { type: "wait", milliseconds: 800 },
            { type: "scroll", direction: "down" }, { type: "wait", milliseconds: 800 },
          ],
        }),
      });
      if (!res.ok) throw new Error(`Firecrawl ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const payload = await res.json() as { data?: { json?: { products?: unknown[] } }; json?: { products?: unknown[] } };
      return (payload.data?.json ?? payload.json ?? {}) as { products?: Array<Record<string, unknown>> };
    }

    const pageUrls = buildPageVariants(data.url);
    const results = await Promise.allSettled(pageUrls.map((u) => scrapeOnce(u)));
    const allItems: Array<Record<string, unknown>> = [];
    for (const r of results) {
      if (r.status === "fulfilled" && r.value.products) allItems.push(...r.value.products);
    }

    const seen = new Set<string>();
    const rows: Array<{
      cat: string; shop: string; shop_url: string;
      name: string; price: string; img: string; url: string; scraped_at: string;
    }> = [];
    const nowIso = new Date().toISOString();
    for (const it of allItems) {
      const name = String((it.name ?? it.title ?? "") as string).trim();
      const img = absoluteUrl((it.image ?? it.img ?? it.image_url) as string | undefined, data.url);
      const rawUrl = absoluteUrl((it.url ?? it.link ?? it.product_url) as string | undefined, data.url);
      const url = validateProductUrl(rawUrl, data.url);
      if (!name || !/^https?:\/\//i.test(img)) continue;
      const key = `${name.toLowerCase()}|${img}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        cat: data.cat, shop: data.shop, shop_url: data.url,
        name: name.slice(0, 200), price: normalizePrice(it.price as string | number | undefined),
        img, url, scraped_at: nowIso,
      });
    }

    if (rows.length === 0) return { inserted: 0, pages: pageUrls.length };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Replace the shop's catalog: delete old, insert fresh
    await supabaseAdmin.from("products").delete().eq("cat", data.cat).eq("shop", data.shop);
    const { error } = await supabaseAdmin.from("products").upsert(rows, {
      onConflict: "cat,shop,img",
      ignoreDuplicates: false,
    });
    if (error) throw new Error(error.message);
    return { inserted: rows.length, pages: pageUrls.length };
  });