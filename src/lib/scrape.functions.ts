import { createServerFn } from "@tanstack/react-start";

export type ScrapedProduct = {
  id: string;
  name: string;
  price: string;
  img: string;
  url: string;
  shopUrl: string;
};

type FirecrawlExtract = {
  products?: Array<{
    name?: string;
    title?: string;
    price?: string | number;
    image?: string;
    img?: string;
    image_url?: string;
    url?: string;
    link?: string;
    product_url?: string;
  }>;
};

function absoluteUrl(maybe: string | undefined, base: string): string {
  if (!maybe) return base;
  try {
    return new URL(maybe, base).toString();
  } catch {
    return base;
  }
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
  } catch {
    return fallback;
  }
}

function buildPageVariants(baseUrl: string): string[] {
  const variants = new Set<string>([baseUrl]);
  try {
    const u = new URL(baseUrl);
    const paramNames = ["page", "pageNumber", "pgno", "start"];
    for (const name of paramNames) {
      const v = new URL(u.toString());
      v.searchParams.set(name, "2");
      variants.add(v.toString());
    }
    // also try a hash-less +1 page-style suffix some shops use
    const v2 = new URL(u.toString());
    v2.searchParams.set("page", "3");
    variants.add(v2.toString());
  } catch {
    // ignore
  }
  return Array.from(variants).slice(0, 5);
}

async function scrapeOnce(
  pageUrl: string,
  apiKey: string,
  schema: unknown,
): Promise<FirecrawlExtract> {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: pageUrl,
      formats: [
        {
          type: "json",
          schema,
          prompt:
            "Extract every product listing visible on this category page. For each item: product name, displayed price (with currency symbol), absolute product image URL, and absolute product page URL (the link to the product detail page, NOT the image URL). Skip ads, banners, navigation, and editorial content.",
        },
      ],
      onlyMainContent: true,
      waitFor: 4000,
      actions: [
        { type: "scroll", direction: "down" },
        { type: "wait", milliseconds: 800 },
        { type: "scroll", direction: "down" },
        { type: "wait", milliseconds: 800 },
        { type: "scroll", direction: "down" },
        { type: "wait", milliseconds: 800 },
        { type: "scroll", direction: "down" },
        { type: "wait", milliseconds: 800 },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firecrawl ${res.status}: ${text.slice(0, 200)}`);
  }
  const payload: { data?: { json?: FirecrawlExtract }; json?: FirecrawlExtract } = await res.json();
  return payload.data?.json ?? payload.json ?? {};
}

export const scrapeShop = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string; shop: string; cat: string }) => {
    if (!data?.url || !/^https?:\/\//i.test(data.url)) {
      throw new Error("Invalid URL");
    }
    return data;
  })
  .handler(async ({ data }) => {
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
              name: { type: "string", description: "Product name or title" },
              price: { type: "string", description: "Price as displayed including currency symbol" },
              image: { type: "string", description: "Absolute URL of the primary product image" },
              url: { type: "string", description: "Absolute URL of the product page" },
            },
            required: ["name", "image"],
          },
        },
      },
      required: ["products"],
    } as const;

    const pageUrls = buildPageVariants(data.url);
    const results = await Promise.allSettled(
      pageUrls.map((u) => scrapeOnce(u, apiKey, schema)),
    );

    const allItems: NonNullable<FirecrawlExtract["products"]> = [];
    for (const r of results) {
      if (r.status === "fulfilled" && r.value.products) {
        allItems.push(...r.value.products);
      }
    }

    const seen = new Set<string>();
    const products: ScrapedProduct[] = [];
    allItems.forEach((it, i) => {
      const name = (it.name ?? it.title ?? "").toString().trim();
      const img = absoluteUrl(it.image ?? it.img ?? it.image_url, data.url);
      const rawUrl = absoluteUrl(it.url ?? it.link ?? it.product_url, data.url);
      const url = validateProductUrl(rawUrl, data.url);
      if (!name || !/^https?:\/\//i.test(img)) return;
      const key = `${name.toLowerCase()}|${img}`;
      if (seen.has(key)) return;
      seen.add(key);
      products.push({
        id: `${data.cat}-${data.shop}-${i}`,
        name: name.slice(0, 80),
        price: normalizePrice(it.price),
        img,
        url,
        shopUrl: data.url,
      });
    });

    return { products };
  });