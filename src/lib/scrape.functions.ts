import { createServerFn } from "@tanstack/react-start";

export type ScrapedProduct = {
  id: string;
  name: string;
  price: string;
  img: string;
  url: string;
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

    let payload: { success?: boolean; data?: { json?: FirecrawlExtract }; json?: FirecrawlExtract; error?: string };
    try {
      const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: data.url,
          formats: [
            {
              type: "json",
              schema,
              prompt:
                "Extract the first 18 product listings shown on this category page. For each item: product name, displayed price (with currency symbol), absolute product image URL, and absolute product page URL. Skip ads, banners, navigation, and editorial content.",
            },
          ],
          onlyMainContent: true,
          waitFor: 1500,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Firecrawl ${res.status}: ${text.slice(0, 200)}`);
      }
      payload = await res.json();
    } catch (err) {
      throw new Error(`Firecrawl scrape failed: ${(err as Error).message}`);
    }

    const extract = payload.data?.json ?? payload.json ?? {};
    const items = extract.products ?? [];

    const products: ScrapedProduct[] = items
      .map((it, i) => {
        const name = (it.name ?? it.title ?? "").toString().trim();
        const img = absoluteUrl(it.image ?? it.img ?? it.image_url, data.url);
        const url = absoluteUrl(it.url ?? it.link ?? it.product_url, data.url);
        return {
          id: `${data.cat}-${data.shop}-${i}`,
          name: name.slice(0, 80),
          price: normalizePrice(it.price),
          img,
          url,
        };
      })
      .filter((p) => p.name && /^https?:\/\//i.test(p.img))
      .slice(0, 12);

    return { products };
  });