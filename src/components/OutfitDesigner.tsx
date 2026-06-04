import { useEffect, useState } from "react";

type CatId = "hair" | "jewelry" | "dress" | "top" | "bottom" | "shoes" | "bag";

const CATS: { id: CatId; label: string; icon: string; sub: string }[] = [
  { id: "hair", label: "Hair", icon: "💇‍♀️", sub: "Wigs, extensions, accessories" },
  { id: "dress", label: "Dresses", icon: "👗", sub: "Mini, midi, gowns" },
  { id: "top", label: "Tops", icon: "👚", sub: "Tees, blouses, crops" },
  { id: "bottom", label: "Bottoms", icon: "👖", sub: "Jeans, skirts, shorts" },
  { id: "shoes", label: "Shoes", icon: "👠", sub: "Heels, boots, flats" },
  { id: "bag", label: "Bags", icon: "👜", sub: "Totes, clutches, shoulders" },
  { id: "jewelry", label: "Jewelry", icon: "💍", sub: "Necklaces, rings, hoops" },
];

const THEMES = [
  { id: "th-default", name: "Soft Pink", c: "#FFB6C1" },
  { id: "th-hotpink", name: "Hot Pink", c: "#FF1493" },
  { id: "th-rosered", name: "Rose Red", c: "#E84393" },
  { id: "th-red", name: "Red", c: "#FF4757" },
  { id: "th-blue", name: "Blue", c: "#5BB8D4" },
  { id: "th-purple", name: "Purple", c: "#A06ABE" },
  { id: "th-lilac", name: "Lilac", c: "#C9A0DC" },
  { id: "th-yellow", name: "Pastel Yellow", c: "#FFE066" },
];

type Shop = { name: string; url: string };

const SHOPS: Record<CatId, Shop[]> = {
  hair: [
    { name: "Sephora", url: "https://www.sephora.com/shop/hair" },
    { name: "Ulta", url: "https://www.ulta.com/hair" },
    { name: "Amazon", url: "https://www.amazon.com/s?k=hair+extensions" },
    { name: "ASOS", url: "https://www.asos.com/us/women/accessories/hair-accessories/cat/?cid=6446" },
  ],
  dress: [
    { name: "ASOS", url: "https://www.asos.com/us/women/dresses/cat/?cid=8799" },
    { name: "Zara", url: "https://www.zara.com/us/en/woman-dresses-l1066.html" },
    { name: "PrettyLittleThing", url: "https://www.prettylittlething.us/clothing-dresses.html" },
    { name: "Oh Polly", url: "https://www.ohpolly.com/collections/dresses" },
    { name: "Reformation", url: "https://www.thereformation.com/categories/dresses" },
    { name: "Revolve", url: "https://www.revolve.com/dresses/br/a8e981/" },
    { name: "Lulus", url: "https://www.lulus.com/categories/8/dresses.html" },
    { name: "Princess Polly", url: "https://us.princesspolly.com/collections/dresses" },
  ],
  top: [
    { name: "Zara", url: "https://www.zara.com/us/en/woman-tshirts-l1362.html" },
    { name: "ASOS", url: "https://www.asos.com/us/women/tops/cat/?cid=4169" },
    { name: "H&M", url: "https://www2.hm.com/en_us/women/products/tops.html" },
    { name: "Aritzia", url: "https://www.aritzia.com/us/en/clothing/tops" },
    { name: "Princess Polly", url: "https://us.princesspolly.com/collections/tops" },
    { name: "PrettyLittleThing", url: "https://www.prettylittlething.us/clothing-tops.html" },
  ],
  bottom: [
    { name: "Levi's", url: "https://www.levi.com/US/en_US/category/women/clothing/jeans" },
    { name: "ASOS", url: "https://www.asos.com/us/women/jeans/cat/?cid=3630" },
    { name: "Madewell", url: "https://www.madewell.com/womens/clothing/denim" },
    { name: "Free People", url: "https://www.freepeople.com/women-bottoms/" },
    { name: "Abercrombie", url: "https://www.abercrombie.com/shop/us/womens-bottoms" },
    { name: "Zara", url: "https://www.zara.com/us/en/woman-jeans-l1119.html" },
  ],
  shoes: [
    { name: "Nike", url: "https://www.nike.com/w/womens-shoes-5e1x6zy7ok" },
    { name: "Steve Madden", url: "https://www.stevemadden.com/collections/all-shoes" },
    { name: "ASOS", url: "https://www.asos.com/us/women/shoes/cat/?cid=4172" },
    { name: "DSW", url: "https://www.dsw.com/en/us/category/womens-shoes/N-1z141fr" },
    { name: "Sam Edelman", url: "https://www.samedelman.com" },
  ],
  bag: [
    { name: "Coach", url: "https://www.coach.com/shop/women-bags" },
    { name: "Telfar", url: "https://shop.telfar.net" },
    { name: "Mansur Gavriel", url: "https://www.mansurgavriel.com" },
    { name: "Nordstrom", url: "https://www.nordstrom.com/browse/women/handbags" },
    { name: "ASOS", url: "https://www.asos.com/us/women/accessories/bags-purses/cat/?cid=8730" },
  ],
  jewelry: [
    { name: "Mejuri", url: "https://mejuri.com" },
    { name: "Catbird", url: "https://www.catbirdnyc.com" },
    { name: "Missoma", url: "https://www.missoma.com" },
    { name: "Brilliant Earth", url: "https://www.brilliantearth.com" },
    { name: "Pandora", url: "https://us.pandora.net" },
  ],
};

type Product = { id: string; name: string; price: string; img: string; url: string };

// Curated product images per (category, shop). Uses Unsplash for visuals.
const img = (q: string, seed: number) =>
  `https://images.unsplash.com/photo-${q}?auto=format&fit=crop&w=400&h=400&q=70&sig=${seed}`;

const PRODUCT_IMAGES: Record<CatId, string[]> = {
  hair: [
    "1605497788044-5a32c7078486",
    "1522336572468-97b06e8ef143",
    "1519699047748-de8e457a634e",
    "1492106087820-71f1a00d2b11",
    "1560869713-7d0a29430803",
    "1595152772835-219674b2a8a6",
  ],
  dress: [
    "1572804013427-4d7ca7268217",
    "1566174053879-31528523f8ae",
    "1539008835657-9e8e9680c956",
    "1515372039744-b8f02a3ae446",
    "1583496661160-fb5886a13d44",
    "1496747611176-843222e1e57c",
    "1568252542512-9fe8fe9c87bb",
    "1595777457583-95e059d581b8",
  ],
  top: [
    "1551488831-00ddcb6c6bd3",
    "1591047139829-d91aecb6caea",
    "1564257631407-4deb1f99d992",
    "1583744946564-b52ac1c389c8",
    "1503342217505-b0a15ec3261c",
    "1556905055-8f358a7a47b2",
  ],
  bottom: [
    "1541099649105-f69ad21f3246",
    "1542272604-787c3835535d",
    "1604176354204-9268737828e4",
    "1582418702059-97ebafb35d09",
    "1591195853828-11db59a44f6b",
    "1594633312681-425c7b97ccd1",
  ],
  shoes: [
    "1543163521-1bf539c55dd2",
    "1542291026-7eec264c27ff",
    "1549298916-b41d501d3772",
    "1606107557195-0e29a4b5b4aa",
    "1560769629-975ec94e6a86",
    "1595950653106-6c9ebd614d3a",
  ],
  bag: [
    "1584917865442-de89df76afd3",
    "1548036328-c9fa89d128fa",
    "1591561954557-26941169b49e",
    "1559563458-527698bf5295",
    "1566150905458-1bf1fc113f0d",
    "1601369850814-87d7ec06fa07",
  ],
  jewelry: [
    "1599643478518-a784e5dc4c8f",
    "1535632066927-ab7c9ab60908",
    "1611652022419-a9419f74343d",
    "1602173574767-37ac01994b2a",
    "1515562141207-7a88fb7ce338",
    "1606760227091-3dd870d97f1d",
  ],
};

const PRODUCT_NAMES: Record<CatId, string[]> = {
  hair: ["Silky Extensions", "Wavy Clip-Ins", "Pearl Clip Set", "Satin Scrunchie", "Hair Bow", "Velvet Headband"],
  dress: ["Slip Mini Dress", "Floral Midi", "Satin Gown", "Bodycon Mini", "Tiered Maxi", "Cocktail Dress", "Wrap Dress", "Corset Dress"],
  top: ["Boxy Tee", "Puff Blouse", "Ribbed Tank", "Crop Top", "Silk Cami", "Knit Sweater"],
  bottom: ["Straight Jeans", "Wide Leg Pants", "Mini Skirt", "Pleated Midi", "Tailored Shorts", "Cargo Pants"],
  shoes: ["Strappy Heels", "Chunky Sneakers", "Ankle Boots", "Ballet Flats", "Platform Sandals", "Knee Boots"],
  bag: ["Quilted Shoulder", "Mini Tote", "Beaded Clutch", "Crossbody Bag", "Bucket Bag", "Top Handle"],
  jewelry: ["Pearl Necklace", "Gold Hoops", "Charm Bracelet", "Stacked Rings", "Layered Chains", "Tennis Necklace"],
};

const SEARCH_TERMS: Record<CatId, string> = {
  hair: "hair",
  dress: "dress",
  top: "blouse",
  bottom: "trousers",
  shoes: "shoes",
  bag: "bag",
  jewelry: "jewellery",
};

type DummyProduct = { id: number; title: string; price: number; thumbnail: string; images: string[] };

async function fetchProducts(cat: CatId, shop: string, signal: AbortSignal): Promise<Product[]> {
  const q = SEARCH_TERMS[cat];
  const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=20`, { signal });
  if (!res.ok) throw new Error(`Products API ${res.status}`);
  const json = (await res.json()) as { products: DummyProduct[] };
  const shopUrl = SHOPS[cat].find((s) => s.name === shop)?.url ?? "#";
  // Stable per-shop ordering: rotate the list so each shop tab feels distinct.
  const offset = shop.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % Math.max(json.products.length, 1);
  const rotated = [...json.products.slice(offset), ...json.products.slice(0, offset)];
  return rotated.slice(0, 12).map((p) => ({
    id: `${cat}-${shop}-${p.id}`,
    name: p.title,
    price: `$${p.price.toFixed(0)}`,
    img: p.thumbnail || p.images?.[0] || "",
    url: shopUrl,
  }));
}

type Selected = Record<CatId, Product | null>;
const emptySel: Selected = {
  hair: null, jewelry: null, dress: null, top: null, bottom: null, shoes: null, bag: null,
};

type SavedLook = { id: string; name: string; items: Selected; ts: number };

const LS_LOOKS = "dressed.looks.v1";
const LS_THEME = "dressed.theme.v1";

export function OutfitDesigner() {
  const [theme, setTheme] = useState<string>("th-default");
  const [cat, setCat] = useState<CatId>("dress");
  const [shopByCat, setShopByCat] = useState<Record<CatId, string>>(() => {
    const init = {} as Record<CatId, string>;
    (Object.keys(SHOPS) as CatId[]).forEach((c) => (init[c] = SHOPS[c][0].name));
    return init;
  });
  const [selected, setSelected] = useState<Selected>(emptySel);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [customUrl, setCustomUrl] = useState("");
  const [customName, setCustomName] = useState("");

  // Hydrate from localStorage on the client only (SSR-safe).
  useEffect(() => {
    const t = localStorage.getItem(LS_THEME);
    if (t) setTheme(t);
    try {
      const l = JSON.parse(localStorage.getItem(LS_LOOKS) ?? "[]");
      if (Array.isArray(l)) setLooks(l);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem(LS_THEME, theme); }, [theme]);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem(LS_LOOKS, JSON.stringify(looks)); }, [looks]);

  const shop = shopByCat[cat];
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetchProducts(cat, shop, ctrl.signal)
      .then((p) => { setProducts(p); setLoading(false); })
      .catch((e) => { if (e.name !== "AbortError") { setError(String(e.message ?? e)); setLoading(false); } });
    return () => ctrl.abort();
  }, [cat, shop]);

  const currentCat = CATS.find((c) => c.id === cat)!;

  const pick = (p: Product) => setSelected((s) => ({ ...s, [cat]: s[cat]?.id === p.id ? null : p }));
  const clear = () => setSelected(emptySel);
  const save = () => {
    const count = Object.values(selected).filter(Boolean).length;
    if (!count) return;
    const name = prompt("Name this look:", `Look #${looks.length + 1}`);
    if (!name) return;
    setLooks((l) => [{ id: crypto.randomUUID(), name, items: selected, ts: Date.now() }, ...l]);
  };
  const loadLook = (l: SavedLook) => setSelected(l.items);
  const addCustom = () => {
    if (!customUrl || !customName) return;
    const p: Product = {
      id: `custom-${Date.now()}`,
      name: customName,
      price: "—",
      img: products[0]?.img ?? "",
      url: customUrl,
    };
    setSelected((s) => ({ ...s, [cat]: p }));
    setCustomUrl(""); setCustomName("");
  };

  return (
    <div className={`dressed ${theme}`}>
      <style>{CSS}</style>
      <header className="hdr">
        <div className="hdr-inner">
          <h1>✨ Outfit Designer</h1>
          <p>Browse your favourite shops & build your perfect look</p>
        </div>
      </header>

      <div className="steps">
        {[
          ["Pick a category", "Hair, Dresses, Tops…"],
          ["Choose a shop", "ASOS, Zara, PLT, Oh Polly…"],
          ["Tap an item", "It appears in your outfit →"],
          ["Save your look", "Build & compare multiple outfits"],
        ].map(([t, s], i) => (
          <div className="step" key={i}>
            <div className="step-n">{i + 1}</div>
            <div className="step-text"><strong>{t}</strong><span>{s}</span></div>
          </div>
        ))}
      </div>

      <div className="tbar">
        <span className="tbar-lbl">Colour theme:</span>
        {THEMES.map((t) => (
          <div
            key={t.id}
            className={`sw ${theme === t.id ? "on" : ""}`}
            style={{ background: t.c }}
            title={t.name}
            onClick={() => setTheme(t.id)}
          />
        ))}
      </div>

      <div className="layout">
        <main>
          <div className="cat-tabs">
            {CATS.map((c) => (
              <button key={c.id} className={`cat-btn ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)}>
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          <div className="sec show">
            <div className="sec-header">
              <div className="sec-title">{currentCat.icon} {currentCat.label}</div>
              <div className="sec-sub">{currentCat.sub}</div>
            </div>

            <div className="shop-scroll">
              <div className="shop-row">
                {SHOPS[cat].map((s) => (
                  <button
                    key={s.name}
                    className={`shop-btn ${shopByCat[cat] === s.name ? "on" : ""}`}
                    onClick={() => setShopByCat((x) => ({ ...x, [cat]: s.name }))}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="prod-grid">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div className="pc" key={i}>
                      <div className="pc-img" style={{ background: "var(--soft)" }} />
                      <div className="pc-info">
                        <span className="pc-name" style={{ background: "var(--soft)", color: "transparent" }}>—</span>
                      </div>
                    </div>
                  ))
                : error
                ? <div style={{ padding: 20, color: "var(--txt2)", fontSize: ".85em" }}>Couldn't load products: {error}</div>
                : products.map((p) => {
                    const sel = selected[cat]?.id === p.id;
                    return (
                      <div key={p.id} className={`pc ${sel ? "sel" : ""}`} onClick={() => pick(p)}>
                        <div className="pc-check">✓</div>
                        <div className="pc-img"><img src={p.img} alt={p.name} loading="lazy" /></div>
                        <div className="pc-info">
                          <span className="pc-name">{p.name}</span>
                          <div className="pc-row">
                            <span className="pc-price">{p.price}</span>
                            <a className="pc-link" href={p.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Shop ↗</a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>

            <div className="add-own">
              <div className="add-own-title">Add your own link</div>
              <div className="add-row">
                <input className="add-in" placeholder="Item name" value={customName} onChange={(e) => setCustomName(e.target.value)} />
                <input className="add-in" placeholder="https://…" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} />
                <button className="add-go" onClick={addCustom}>Add</button>
              </div>
              <div className="add-hint">Paste any product URL — it'll appear in your outfit for the <strong>{currentCat.label}</strong> slot.</div>
              <div className="qlinks-wrap">
                <div className="qlinks-lbl">Quick shop links</div>
                <div className="qlinks">
                  {SHOPS[cat].map((s) => (
                    <a key={s.url} className="ql" href={s.url} target="_blank" rel="noreferrer">{s.name} ↗</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="sidebar">
          <div className="ob">
            <div className="ob-head"><h3>My Outfit</h3></div>
            <div className="ob-body">
              <Flatlay selected={selected} />
              <div className="ob-btns">
                <button className="ob-btn p" onClick={save}>💾 Save Look</button>
                <button className="ob-btn s" onClick={clear}>🗑 Clear</button>
              </div>
              <div className="saved-sec">
                <div className="saved-lbl">💖 Saved Looks</div>
                {looks.length === 0 ? (
                  <div className="no-looks">No saved looks yet…</div>
                ) : (
                  looks.map((l) => (
                    <div key={l.id} className="look-item" onClick={() => loadLook(l)}>
                      <span>{l.name}</span>
                      <span className="look-count">{Object.values(l.items).filter(Boolean).length} pcs</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Flatlay({ selected }: { selected: Selected }) {
  const slot = (id: CatId, wide = false) => {
    const p = selected[id];
    const cat = CATS.find((c) => c.id === id)!;
    return (
      <div className={`fl-slot ${wide ? "wide" : ""} ${p ? "has" : ""}`}>
        {p ? (
          <>
            <div className="fl-bg"><img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div className="fl-name">{p.name}</div>
          </>
        ) : (
          <>
            <div className="fl-empty-ico">{cat.icon}</div>
            <div className="fl-empty-lbl">{cat.label}</div>
          </>
        )}
      </div>
    );
  };
  return (
    <div className="fl">
      <div className="fl-row">{slot("hair")}{slot("jewelry")}</div>
      <div className="fl-row">{slot("dress", true)}</div>
      <div className="fl-row">{slot("top")}</div>
      <div className="fl-row">{slot("bottom")}</div>
      <div className="fl-row">{slot("shoes")}{slot("bag")}</div>
    </div>
  );
}

const CSS = `
.dressed{--g1:#FFB6C1;--g2:#FF85A1;--acc:#FF4D79;--bg:#FFF3F7;--card:#fff;--txt:#2d1520;--txt2:#9a6070;--soft:#FFE8EF;--border:#FFD0DC;--glow:rgba(255,133,161,.25);font-family:'Inter',sans-serif;background:var(--bg);color:var(--txt);min-height:100vh;transition:background .3s;}
.dressed.th-hotpink{--g1:#FF69B4;--g2:#FF1493;--acc:#C71585;--bg:#FFF0F8;--txt:#3a001f;--txt2:#b05080;--soft:#FFD6EC;--border:#FFB3D9;--glow:rgba(255,20,147,.2);}
.dressed.th-rosered{--g1:#FF6B8A;--g2:#E84393;--acc:#c0185d;--bg:#FFF2F5;--txt:#3a0018;--txt2:#b04060;--soft:#FFD0DC;--border:#FFB0C4;--glow:rgba(232,67,147,.2);}
.dressed.th-blue{--g1:#A8D8EA;--g2:#5BB8D4;--acc:#1d6fa4;--bg:#F0F8FF;--txt:#0d2d40;--txt2:#4080a0;--soft:#D6EEF8;--border:#B0D8F0;--glow:rgba(91,184,212,.2);}
.dressed.th-purple{--g1:#C9A0DC;--g2:#A06ABE;--acc:#7c2d9e;--bg:#F8F0FF;--txt:#2d0a45;--txt2:#8050a0;--soft:#EAD8F8;--border:#D4B8F0;--glow:rgba(160,106,190,.2);}
.dressed.th-lilac{--g1:#E0C8F8;--g2:#C9A0DC;--acc:#9b59b6;--bg:#FAF0FF;--txt:#330a55;--txt2:#9060b0;--soft:#EEE0FF;--border:#DCCAF0;--glow:rgba(201,160,220,.2);}
.dressed.th-yellow{--g1:#FFF0A0;--g2:#FFE066;--acc:#b8860b;--bg:#FFFDF0;--txt:#443500;--txt2:#887020;--soft:#FFFADC;--border:#FFE8A0;--glow:rgba(255,224,102,.25);}
.dressed.th-red{--g1:#FF9090;--g2:#FF4757;--acc:#cc1a2a;--bg:#FFF2F2;--txt:#450000;--txt2:#aa4050;--soft:#FFE0E0;--border:#FFB8B8;--glow:rgba(255,71,87,.2);}
.dressed *{box-sizing:border-box;}
.dressed .hdr{background:linear-gradient(135deg,var(--g1) 0%,var(--g2) 100%);padding:30px 40px 26px;text-align:center;position:relative;overflow:hidden;}
.dressed .hdr-inner{position:relative;z-index:1;}
.dressed .hdr h1{font-family:'Playfair Display',Georgia,serif;font-size:2.8em;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.15);letter-spacing:1px;margin-bottom:6px;font-weight:700;}
.dressed .hdr p{color:rgba(255,255,255,.9);font-size:.95em;font-weight:300;letter-spacing:.5px;}
.dressed .steps{display:flex;background:var(--card);border-bottom:1px solid var(--border);overflow-x:auto;}
.dressed .step{flex:1;min-width:180px;display:flex;align-items:center;gap:10px;padding:12px 20px;border-right:1px solid var(--border);}
.dressed .step:last-child{border-right:none;}
.dressed .step-n{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;display:flex;align-items:center;justify-content:center;font-size:.85em;font-weight:700;box-shadow:0 2px 8px var(--glow);}
.dressed .step-text strong{display:block;font-size:.82em;color:var(--txt);font-weight:600;}
.dressed .step-text span{font-size:.75em;color:var(--txt2);}
.dressed .tbar{display:flex;align-items:center;gap:10px;padding:12px 28px;background:var(--card);border-bottom:1px solid var(--border);flex-wrap:wrap;justify-content:center;}
.dressed .tbar-lbl{font-size:.78em;font-weight:600;color:var(--txt2);letter-spacing:.5px;text-transform:uppercase;}
.dressed .sw{width:30px;height:30px;border-radius:50%;cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.12);transition:transform .2s,box-shadow .2s;position:relative;flex-shrink:0;}
.dressed .sw:hover{transform:scale(1.3);}
.dressed .sw.on{box-shadow:0 0 0 3px var(--g2);}
.dressed .sw.on::after{content:'✓';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,.4);}
.dressed .layout{display:grid;grid-template-columns:1fr 320px;gap:22px;padding:22px 28px;max-width:1480px;margin:0 auto;}
@media(max-width:960px){.dressed .layout{grid-template-columns:1fr;padding:14px;}.dressed .sidebar{position:static!important;}}
.dressed .cat-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.dressed .cat-btn{display:flex;align-items:center;gap:7px;padding:10px 20px;border-radius:50px;border:2px solid var(--border);background:var(--card);font-family:inherit;font-size:.85em;font-weight:600;color:var(--txt);cursor:pointer;transition:all .2s;}
.dressed .cat-btn:hover{background:var(--soft);border-color:var(--g2);transform:translateY(-1px);}
.dressed .cat-btn.on{background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;border-color:transparent;box-shadow:0 4px 14px var(--glow);}
.dressed .cat-btn span{font-size:1.1em;}
.dressed .sec{display:none;}.dressed .sec.show{display:block;}
.dressed .sec-header{display:flex;align-items:baseline;gap:10px;margin-bottom:16px;flex-wrap:wrap;}
.dressed .sec-title{font-family:'Playfair Display',Georgia,serif;font-size:1.55em;font-weight:700;color:var(--txt);}
.dressed .sec-sub{font-size:.82em;color:var(--txt2);}
.dressed .shop-scroll{overflow-x:auto;padding-bottom:8px;margin-bottom:16px;}
.dressed .shop-row{display:flex;gap:7px;width:max-content;}
.dressed .shop-btn{padding:7px 18px;border-radius:22px;white-space:nowrap;border:1.5px solid var(--border);background:var(--card);font-family:inherit;font-size:.78em;font-weight:500;color:var(--txt);cursor:pointer;transition:all .15s;}
.dressed .shop-btn:hover{background:var(--soft);border-color:var(--g2);}
.dressed .shop-btn.on{background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;border-color:transparent;box-shadow:0 2px 10px var(--glow);}
.dressed .prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:20px;}
.dressed .pc{border-radius:16px;overflow:hidden;cursor:pointer;background:var(--card);border:2px solid var(--border);box-shadow:0 2px 12px rgba(0,0,0,.06);transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s,border-color .2s;position:relative;}
.dressed .pc:hover{transform:translateY(-5px) scale(1.01);box-shadow:0 12px 32px rgba(0,0,0,.12);border-color:var(--g2);}
.dressed .pc.sel{border-color:var(--acc);box-shadow:0 0 0 3px var(--g1),0 8px 24px rgba(0,0,0,.1);}
.dressed .pc.sel .pc-check{opacity:1;transform:scale(1);}
.dressed .pc-check{position:absolute;top:10px;right:10px;z-index:3;width:28px;height:28px;border-radius:50%;background:var(--acc);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;opacity:0;transform:scale(.6);transition:opacity .2s,transform .25s cubic-bezier(.34,1.56,.64,1);box-shadow:0 2px 10px rgba(0,0,0,.25);}
.dressed .pc-img{width:100%;height:190px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:var(--soft);}
.dressed .pc-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .35s ease;}
.dressed .pc:hover .pc-img img{transform:scale(1.05);}
.dressed .pc-info{padding:11px 12px 13px;}
.dressed .pc-name{font-size:.8em;font-weight:700;color:var(--txt);display:block;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.dressed .pc-row{display:flex;align-items:center;justify-content:space-between;margin-top:6px;gap:6px;}
.dressed .pc-price{font-size:.82em;font-weight:700;color:var(--acc);}
.dressed .pc-link{font-size:.68em;color:var(--g2);text-decoration:none;padding:3px 9px;border:1.5px solid var(--g2);border-radius:10px;transition:all .15s;font-weight:600;}
.dressed .pc-link:hover{background:var(--g2);color:#fff;}
.dressed .add-own{background:var(--card);border-radius:16px;border:2px dashed var(--border);padding:18px 20px;margin-bottom:18px;}
.dressed .add-own-title{font-size:.82em;font-weight:700;color:var(--txt2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px;display:flex;align-items:center;gap:7px;}
.dressed .add-row{display:flex;gap:8px;flex-wrap:wrap;}
.dressed .add-in{flex:1;min-width:130px;padding:9px 14px;border-radius:11px;border:1.5px solid var(--border);font-size:.8em;color:var(--txt);background:var(--bg);outline:none;font-family:inherit;}
.dressed .add-in:focus{border-color:var(--g2);}
.dressed .add-go{padding:9px 18px;border-radius:11px;border:none;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;cursor:pointer;font-size:.8em;font-weight:700;font-family:inherit;box-shadow:0 2px 10px var(--glow);}
.dressed .add-hint{font-size:.72em;color:var(--txt2);margin-top:8px;line-height:1.5;}
.dressed .qlinks-wrap{padding-top:14px;margin-top:14px;border-top:1px dashed var(--border);}
.dressed .qlinks-lbl{font-size:.72em;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--txt2);margin-bottom:9px;}
.dressed .qlinks{display:flex;gap:7px;flex-wrap:wrap;}
.dressed .ql{padding:5px 14px;border-radius:18px;background:var(--soft);border:1.5px solid var(--border);font-size:.76em;color:var(--txt);text-decoration:none;font-weight:500;}
.dressed .ql:hover{background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;border-color:transparent;}
.dressed .sidebar{position:sticky;top:20px;height:fit-content;}
.dressed .ob{background:var(--card);border-radius:22px;border:1.5px solid var(--border);box-shadow:0 8px 32px rgba(0,0,0,.08);overflow:hidden;}
.dressed .ob-head{background:linear-gradient(135deg,var(--g1),var(--g2));padding:18px 22px;text-align:center;}
.dressed .ob-head h3{font-family:'Playfair Display',Georgia,serif;font-size:1.2em;color:#fff;font-style:italic;}
.dressed .ob-body{padding:18px;}
.dressed .fl{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}
.dressed .fl-row{display:flex;gap:8px;}
.dressed .fl-slot{flex:1;min-height:80px;border-radius:14px;border:2px dashed var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--soft);overflow:hidden;position:relative;}
.dressed .fl-slot.wide{min-height:110px;}
.dressed .fl-slot.has{border-style:solid;border-color:var(--g1);background:var(--card);}
.dressed .fl-slot .fl-bg{position:absolute;inset:0;}
.dressed .fl-slot .fl-name{position:absolute;bottom:0;left:0;right:0;background:rgba(255,255,255,.92);padding:4px 7px;font-size:.62em;font-weight:700;color:var(--txt);text-align:center;backdrop-filter:blur(6px);}
.dressed .fl-empty-ico{font-size:1.8em;opacity:.4;}
.dressed .fl-empty-lbl{font-size:.62em;color:var(--txt2);opacity:.7;margin-top:3px;}
.dressed .ob-btns{display:flex;gap:8px;margin-bottom:14px;}
.dressed .ob-btn{flex:1;padding:11px;border-radius:12px;border:none;cursor:pointer;font-size:.84em;font-weight:700;font-family:inherit;transition:all .2s;}
.dressed .ob-btn.p{background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;box-shadow:0 3px 12px var(--glow);}
.dressed .ob-btn.s{background:var(--soft);color:var(--txt);border:1.5px solid var(--border);}
.dressed .saved-sec{border-top:1.5px dashed var(--border);padding-top:14px;}
.dressed .saved-lbl{font-size:.78em;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--txt2);margin-bottom:10px;}
.dressed .look-item{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border-radius:11px;background:var(--soft);margin-bottom:6px;font-size:.8em;cursor:pointer;border:1.5px solid var(--border);font-weight:500;}
.dressed .look-item:hover{background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;border-color:transparent;}
.dressed .look-count{font-size:.72em;color:var(--txt2);}
.dressed .no-looks{font-size:.76em;color:var(--txt2);text-align:center;padding:10px 0;font-style:italic;}
`;