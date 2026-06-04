import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { refreshShop } from "@/lib/products.functions";

type CatId = "hair" | "jewelry" | "dress" | "top" | "bottom" | "shoes" | "bag";
type Shop = { name: string; url: string };

const SHOPS: Record<CatId, Shop[]> = {
  hair: [
    { name: "ASOS", url: "https://www.asos.com/women/accessories/hair-accessories/cat/?cid=11412" },
    { name: "Boots", url: "https://www.boots.com/beauty/hair/hair-accessories" },
    { name: "Look Fantastic", url: "https://www.lookfantastic.com/c/health-beauty/hair/tools-accessories/hair-accessories/" },
    { name: "Sephora UK", url: "https://www.sephora.co.uk/hair/hair-accessories" },
    { name: "Selfridges", url: "https://www.selfridges.com/GB/en/cat/womens/accessories/hair-accessories/" },
    { name: "Superdrug", url: "https://www.superdrug.com/hair/hair-accessories/c/hair-access" },
    { name: "Revolve", url: "https://www.revolve.com/beauty-hair-hair-tools-hair-accessories/br/3c7f75/" },
    { name: "Urban Outfitters", url: "https://www.urbanoutfitters.com/hair-accessories-for-women" },
    { name: "Etsy UK", url: "https://www.etsy.com/uk/c/accessories/hair-accessories" },
    { name: "Hairburst", url: "https://www.hairburst.com/collections/shop-all" },
  ],
  dress: [
    { name: "ASOS", url: "https://www.asos.com/women/dresses/cat/?cid=8799" },
    { name: "PLT", url: "https://www.prettylittlething.com/categories/womens-dresses" },
    { name: "Oh Polly", url: "https://www.ohpolly.com/collections/dresses-collection" },
    { name: "Zara UK", url: "https://www.zara.com/uk/en/woman-dresses-l1066.html" },
    { name: "Revolve", url: "https://www.revolve.com/dresses/br/68fec2/" },
    { name: "House of CB", url: "https://app.houseofcb.com/category?category_id=3" },
    { name: "Nasty Gal", url: "https://www.nastygal.com/categories/womens-dresses" },
    { name: "Boohoo", url: "https://www.boohoo.com/categories/womens-dresses" },
    { name: "Shein UK", url: "https://www.shein.co.uk/Women-Dresses-c-1727.html" },
    { name: "Net-a-Porter", url: "https://www.net-a-porter.com/en-gb/shop/clothing/dresses" },
    { name: "Missguided", url: "https://www.missguided.com/category/Women-Dresses-12716" },
    { name: "In The Style", url: "https://www.inthestyle.com/collections/dresses" },
    { name: "Free People", url: "https://www.freepeople.com/dresses/" },
    { name: "Reiss", url: "https://www.reiss.com/gb/en/shop/gender-women-category-dresses" },
    { name: "Sabo Skirt", url: "https://us.saboskirt.com/collections/dresses" },
  ],
  top: [
    { name: "ASOS", url: "https://www.asos.com/women/tops/cat/?cid=4169" },
    { name: "Zara UK", url: "https://www.zara.com/uk/en/woman-tops-l1322.html" },
    { name: "H&M UK", url: "https://www2.hm.com/en_gb/ladies/shop-by-product/tops.html" },
    { name: "PLT", url: "https://www.prettylittlething.com/categories/womens-tops" },
    { name: "Nasty Gal", url: "https://www.nastygal.com/womens/tops" },
    { name: "Revolve", url: "https://www.revolve.com/tops/br/db773d/" },
    { name: "Urban Outfitters", url: "https://www.urbanoutfitters.com/womens-tops" },
    { name: "Monki", url: "https://www.monki.com/en/clothing/tops.html" },
    { name: "Boohoo", url: "https://www.boohoo.com/categories/womens-tops" },
    { name: "Shein UK", url: "https://www.shein.co.uk/Women-Tops-c-2223.html" },
    { name: "Oh Polly", url: "https://www.ohpolly.com/collections/tops-collection" },
    { name: "Weekday", url: "https://www.weekday.com/en-ww/women/t-shirts-and-tops/" },
    { name: "Free People", url: "https://www.freepeople.com/tops/" },
    { name: "Topshop", url: "https://www.topshop.com/gb/topshop/category/tops?cid=52788" },
  ],
  bottom: [
    { name: "ASOS", url: "https://www.asos.com/women/skirts/cat/?cid=2639" },
    { name: "Zara UK", url: "https://www.zara.com/uk/en/woman-skirts-l1299.html" },
    { name: "PLT", url: "https://www.prettylittlething.com/categories/womens-bottoms" },
    { name: "H&M UK", url: "https://www2.hm.com/en_gb/ladies/shop-by-product/skirts.html" },
    { name: "Nasty Gal", url: "https://www.nastygal.com/categories/womens-skirts-mini-skirts" },
    { name: "Revolve", url: "https://www.revolve.com/skirts/br/8b6a66/" },
    { name: "Urban Outfitters", url: "https://www.urbanoutfitters.com/skirts" },
    { name: "Monki", url: "https://www.monki.com/en/clothing/skirts.html" },
    { name: "Boohoo", url: "https://www.boohoo.com/categories/womens-skirts" },
    { name: "Shein UK", url: "https://www.shein.co.uk/Women-Skirts-c-1732.html" },
    { name: "Oh Polly", url: "https://us.ohpolly.com/collections/skirts" },
    { name: "Topshop", url: "https://www.topshop.com/gb/topshop/category/skirts?cid=52793" },
    { name: "Free People", url: "https://www.freepeople.com/skirts/" },
    { name: "Weekday", url: "https://www.weekday.com/en-ww/women/skirts/" },
  ],
  shoes: [
    { name: "ASOS", url: "https://www.asos.com/women/shoes/cat/?cid=4172" },
    { name: "Zara UK", url: "https://www.zara.com/uk/en/woman-shoes-l1251.html" },
    { name: "PLT", url: "https://www.prettylittlething.com/categories/womens-shoes" },
    { name: "Kurt Geiger", url: "https://www.kurtgeiger.com/women/shoes" },
    { name: "Office", url: "https://www.office.co.uk/womens" },
    { name: "Schuh", url: "https://www.schuh.co.uk/womens/" },
    { name: "Steve Madden", url: "https://www.stevemadden.com/collections/womens-heels" },
    { name: "Public Desire", url: "https://www.publicdesire.com/collections/all-footwear" },
    { name: "Dune London", url: "https://www.dunelondon.com/gb/en/womens-shoes/" },
    { name: "UGG", url: "https://www.ugg.com/women-boots/" },
    { name: "Revolve", url: "https://www.revolve.com/shoes/br/3f40a9/" },
    { name: "Nasty Gal", url: "https://www.nastygal.com/categories/womens-shoes" },
    { name: "Jimmy Choo", url: "https://gb.jimmychoo.com/en/women/shoes/" },
    { name: "Louboutin", url: "https://gb.christianlouboutin.com/gb_en/women/shoes/" },
    { name: "New Look", url: "https://www.newlook.com/uk/womens/footwear/shoes/c/uk-womens-footwear-shoes" },
  ],
  bag: [
    { name: "ASOS", url: "https://www.asos.com/women/bags-purses/cat/?cid=8730" },
    { name: "Zara UK", url: "https://www.zara.com/uk/en/woman-bags-l1024.html" },
    { name: "PLT", url: "https://www.prettylittlething.com/categories/womens-accessories-bags" },
    { name: "Kurt Geiger", url: "https://www.kurtgeiger.com/women/bags" },
    { name: "Selfridges", url: "https://www.selfridges.com/GB/en/cat/bags/womens/" },
    { name: "Net-a-Porter", url: "https://www.net-a-porter.com/en-gb/shop/bags" },
    { name: "Coach", url: "https://www.coach.com/shop/women/handbags/view-all" },
    { name: "Loewe", url: "https://www.loewe.com/gbr/en/women/bags" },
    { name: "Mulberry", url: "https://www.mulberry.com/gb/shop/women/bags" },
    { name: "Revolve", url: "https://www.revolve.com/bags/br/52edf9/" },
    { name: "Farfetch", url: "https://www.farfetch.com/shopping/women/bags-purses-1/items.aspx" },
    { name: "Nasty Gal", url: "https://www.nastygal.com/categories/womens-accessories-bags" },
    { name: "Gucci", url: "https://www.gucci.com/gb/en/ca/bags-for-women-c-women-bags" },
    { name: "Prada", url: "https://www.prada.com/gb/en/womens/bags/c/10062UK" },
    { name: "Mango", url: "https://shop.mango.com/gb/en/c/women/bags/8dff98e6" },
  ],
  jewelry: [
    { name: "ASOS", url: "https://www.asos.com/women/jewellery/cat/?cid=4175" },
    { name: "Missoma", url: "https://www.missoma.com/collections/shop-all" },
    { name: "Pandora UK", url: "https://uk.pandora.net/en/jewellery/" },
    { name: "Astrid & Miyu", url: "https://www.astridandmiyu.com/collections/all-jewellery" },
    { name: "Mejuri", url: "https://mejuri.com/collections/shop-all" },
    { name: "Swarovski UK", url: "https://www.swarovski.com/en_GB-GB/c-01/Categories/Jewellery/" },
    { name: "Monica Vinader", url: "https://www.monicavinader.com/gb/shop/jewellery" },
    { name: "Etsy UK", url: "https://www.etsy.com/uk/c/jewelry" },
    { name: "Lovisa", url: "https://www.lovisa.com/collections/shop-all-items" },
    { name: "Wolf Circus", url: "https://www.wolfcircus.com/collections/all" },
    { name: "Tatty Devine", url: "https://www.tattydevine.com/collections/view-all" },
    { name: "PLT", url: "https://www.prettylittlething.com/categories/womens-accessories-jewellery" },
    { name: "Tiffany & Co", url: "https://www.tiffany.com/jewelry/" },
    { name: "Gorjana", url: "https://www.gorjana.com/collections/shop-all" },
  ],
};

const CAT_LABELS: Record<CatId, string> = {
  hair: "Hair", dress: "Dresses", top: "Tops", bottom: "Bottoms",
  shoes: "Shoes", bag: "Bags", jewelry: "Jewelry",
};

type Status = "idle" | "running" | "ok" | "err";
type Row = { cat: CatId; shop: string; url: string; status: Status; msg?: string };

export const Route = createFileRoute("/admin/refresh")({
  head: () => ({ meta: [{ title: "Admin · Refresh Product Cache" }, { name: "robots", content: "noindex" }] }),
  component: AdminRefresh,
});

function AdminRefresh() {
  const refresh = useServerFn(refreshShop);
  const initial: Row[] = (Object.keys(SHOPS) as CatId[]).flatMap((cat) =>
    SHOPS[cat].map((s) => ({ cat, shop: s.name, url: s.url, status: "idle" as Status })),
  );
  const [rows, setRows] = useState<Row[]>(initial);
  const [running, setRunning] = useState(false);

  const setRow = (cat: CatId, shop: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.cat === cat && r.shop === shop ? { ...r, ...patch } : r)));

  async function runOne(row: Row) {
    setRow(row.cat, row.shop, { status: "running", msg: undefined });
    try {
      const res = await refresh({ data: { url: row.url, cat: row.cat, shop: row.shop } });
      setRow(row.cat, row.shop, { status: "ok", msg: `${res.inserted} items` });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      setRow(row.cat, row.shop, { status: "err", msg });
    }
  }

  async function runAll() {
    setRunning(true);
    for (const r of rows) {
      await runOne(r);
    }
    setRunning(false);
  }

  const totals = {
    ok: rows.filter((r) => r.status === "ok").length,
    err: rows.filter((r) => r.status === "err").length,
    total: rows.length,
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2em", marginBottom: 6 }}>Refresh product cache</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Re-scrape shops with Firecrawl and write fresh results into the database. Each shop replaces its previous cache.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
        <button
          onClick={runAll}
          disabled={running}
          style={{
            padding: "10px 22px", borderRadius: 10, border: "none",
            background: running ? "#ccc" : "linear-gradient(135deg,#FFB6C1,#FF85A1)",
            color: "#fff", fontWeight: 700, cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "Refreshing all…" : "↻ Refresh all shops"}
        </button>
        <span style={{ color: "#666", fontSize: 14 }}>
          {totals.ok} ok · {totals.err} failed · {totals.total} total
        </span>
      </div>

      {(Object.keys(SHOPS) as CatId[]).map((cat) => (
        <section key={cat} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: "1.1em", marginBottom: 10, color: "#2d1520" }}>{CAT_LABELS[cat]}</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {rows.filter((r) => r.cat === cat).map((r) => (
              <div
                key={`${r.cat}-${r.shop}`}
                style={{
                  display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center",
                  padding: "10px 14px", border: "1px solid #eee", borderRadius: 10, background: "#fff",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{r.shop}</div>
                  <div style={{ fontSize: 12, color: "#888", wordBreak: "break-all" }}>{r.url}</div>
                </div>
                <div style={{ fontSize: 13, minWidth: 130, textAlign: "right", color: r.status === "err" ? "#c00" : r.status === "ok" ? "#078a3a" : "#666" }}>
                  {r.status === "running" ? "Refreshing…" : r.status === "ok" ? `✓ ${r.msg}` : r.status === "err" ? `✗ ${r.msg}` : "—"}
                </div>
                <button
                  onClick={() => runOne(r)}
                  disabled={running || r.status === "running"}
                  style={{
                    padding: "6px 14px", borderRadius: 8, border: "1px solid #ddd",
                    background: "#fff", cursor: "pointer", fontSize: 13,
                  }}
                >
                  Refresh
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}