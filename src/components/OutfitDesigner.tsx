import { useState } from "react";

type Category =
  | "hair"
  | "tops"
  | "bottoms"
  | "dresses"
  | "shoes"
  | "bags"
  | "jewelry";

const PALETTE = [
  // pinks
  "#fdd5e9", "#f9a8c9", "#f472b6", "#ec4899", "#be185d",
  // blues
  "#dbeafe", "#a5c8f5", "#60a5fa", "#3b82f6", "#1e3a8a",
  // pastel yellow / purple
  "#fef3a8", "#fde68a", "#e9d5ff", "#c4b5fd", "#a78bfa",
  // reds
  "#fecaca", "#fb7185", "#ef4444", "#b91c1c",
  // neutrals for hair/skin accents
  "#3b2a1a", "#8b5a2b", "#d4a373", "#f5deb3", "#ffffff", "#1a1a1a",
];

type StyleDef = { id: string; label: string; defaultColor: string };

const STYLES: Record<Category, StyleDef[]> = {
  hair: [
    { id: "long", label: "Long & flowing", defaultColor: "#8b5a2b" },
    { id: "bob", label: "Sleek bob", defaultColor: "#1a1a1a" },
    { id: "ponytail", label: "High ponytail", defaultColor: "#3b2a1a" },
    { id: "curls", label: "Bouncy curls", defaultColor: "#d4a373" },
  ],
  tops: [
    { id: "tee", label: "Boxy tee", defaultColor: "#fdd5e9" },
    { id: "crop", label: "Crop top", defaultColor: "#f472b6" },
    { id: "blouse", label: "Puff blouse", defaultColor: "#e9d5ff" },
    { id: "tank", label: "Ribbed tank", defaultColor: "#a5c8f5" },
  ],
  bottoms: [
    { id: "jeans", label: "Straight jeans", defaultColor: "#60a5fa" },
    { id: "mini", label: "Mini skirt", defaultColor: "#f9a8c9" },
    { id: "midi", label: "Midi skirt", defaultColor: "#c4b5fd" },
    { id: "shorts", label: "Tailored shorts", defaultColor: "#fde68a" },
  ],
  dresses: [
    { id: "none", label: "No dress", defaultColor: "#ffffff" },
    { id: "slip", label: "Slip dress", defaultColor: "#f472b6" },
    { id: "aline", label: "A-line", defaultColor: "#a5c8f5" },
    { id: "gown", label: "Long gown", defaultColor: "#c4b5fd" },
  ],
  shoes: [
    { id: "sneaker", label: "Chunky sneakers", defaultColor: "#ffffff" },
    { id: "heel", label: "Strappy heels", defaultColor: "#ec4899" },
    { id: "boot", label: "Ankle boots", defaultColor: "#1a1a1a" },
    { id: "flat", label: "Ballet flats", defaultColor: "#fdd5e9" },
  ],
  bags: [
    { id: "tote", label: "Tote", defaultColor: "#fde68a" },
    { id: "shoulder", label: "Shoulder bag", defaultColor: "#f472b6" },
    { id: "clutch", label: "Clutch", defaultColor: "#a78bfa" },
    { id: "none", label: "No bag", defaultColor: "#ffffff" },
  ],
  jewelry: [
    { id: "hoops", label: "Gold hoops", defaultColor: "#f5deb3" },
    { id: "pearls", label: "Pearl necklace", defaultColor: "#ffffff" },
    { id: "chain", label: "Silver chain", defaultColor: "#e5e7eb" },
    { id: "none", label: "No jewelry", defaultColor: "#ffffff" },
  ],
};

const SHOPS: Record<Category, { name: string; url: string }[]> = {
  hair: [
    { name: "Sephora", url: "https://www.sephora.com/shop/hair" },
    { name: "Ulta", url: "https://www.ulta.com/hair" },
    { name: "Amika", url: "https://www.loveamika.com" },
    { name: "Olaplex", url: "https://olaplex.com" },
  ],
  tops: [
    { name: "Zara", url: "https://www.zara.com/us/en/woman-tshirts-l1362.html" },
    { name: "H&M", url: "https://www2.hm.com/en_us/women/products/tops.html" },
    { name: "Aritzia", url: "https://www.aritzia.com/us/en/clothing/tops" },
    { name: "Reformation", url: "https://www.thereformation.com/categories/tops" },
    { name: "Princess Polly", url: "https://us.princesspolly.com/collections/tops" },
  ],
  bottoms: [
    { name: "Levi's", url: "https://www.levi.com/US/en_US/category/women/clothing/jeans" },
    { name: "Abercrombie", url: "https://www.abercrombie.com/shop/us/womens-bottoms" },
    { name: "Madewell", url: "https://www.madewell.com/womens/clothing/denim" },
    { name: "Free People", url: "https://www.freepeople.com/women-bottoms/" },
  ],
  dresses: [
    { name: "Reformation", url: "https://www.thereformation.com/categories/dresses" },
    { name: "Lulus", url: "https://www.lulus.com/categories/8/dresses.html" },
    { name: "Revolve", url: "https://www.revolve.com/dresses/br/a8e981/" },
    { name: "ASOS", url: "https://www.asos.com/us/women/dresses/cat/?cid=8799" },
  ],
  shoes: [
    { name: "Nike", url: "https://www.nike.com/w/womens-shoes-5e1x6zy7ok" },
    { name: "Steve Madden", url: "https://www.stevemadden.com/collections/all-shoes" },
    { name: "Sam Edelman", url: "https://www.samedelman.com" },
    { name: "DSW", url: "https://www.dsw.com/en/us/category/womens-shoes/N-1z141fr" },
  ],
  bags: [
    { name: "Coach", url: "https://www.coach.com/shop/women-bags" },
    { name: "Telfar", url: "https://shop.telfar.net" },
    { name: "Mansur Gavriel", url: "https://www.mansurgavriel.com" },
    { name: "Nordstrom", url: "https://www.nordstrom.com/browse/women/handbags" },
  ],
  jewelry: [
    { name: "Mejuri", url: "https://mejuri.com" },
    { name: "Catbird", url: "https://www.catbirdnyc.com" },
    { name: "Missoma", url: "https://www.missoma.com" },
    { name: "Brilliant Earth", url: "https://www.brilliantearth.com" },
  ],
};

const CATEGORY_LABELS: Record<Category, string> = {
  hair: "Hair",
  tops: "Top",
  bottoms: "Bottom",
  dresses: "Dress",
  shoes: "Shoes",
  bags: "Bag",
  jewelry: "Jewelry",
};

type Selection = { style: string; color: string };
type Outfit = Record<Category, Selection>;

function initialOutfit(): Outfit {
  const out = {} as Outfit;
  (Object.keys(STYLES) as Category[]).forEach((c) => {
    out[c] = { style: STYLES[c][0].id, color: STYLES[c][0].defaultColor };
  });
  return out;
}

export function OutfitDesigner() {
  const [outfit, setOutfit] = useState<Outfit>(initialOutfit);
  const [active, setActive] = useState<Category>("tops");

  const update = (cat: Category, patch: Partial<Selection>) =>
    setOutfit((o) => ({ ...o, [cat]: { ...o[cat], ...patch } }));

  const cats = Object.keys(STYLES) as Category[];
  const sel = outfit[active];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 px-6 py-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Dressed <span className="text-primary">·</span> outfit designer
        </h1>
        <p className="text-sm text-muted-foreground">
          Mix pieces, recolor them, and shop the look.
        </p>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[480px,1fr]">
        {/* Visual */}
        <section className="sticky top-6 self-start rounded-3xl border border-border bg-card p-6 shadow-sm">
          <OutfitMannequin outfit={outfit} />
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {cats.map((c) => (
              <div
                key={c}
                className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground"
                title={CATEGORY_LABELS[c]}
              >
                <span
                  className="h-5 w-5 rounded-full border border-border"
                  style={{ background: outfit[c].color }}
                />
                <span>{CATEGORY_LABELS[c]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Controls */}
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  active === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent"
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">{CATEGORY_LABELS[active]} style</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STYLES[active].map((s) => (
                <button
                  key={s.id}
                  onClick={() => update(active, { style: s.id })}
                  className={`rounded-2xl border px-3 py-2 text-sm transition ${
                    sel.style === s.id
                      ? "border-primary bg-accent"
                      : "border-border hover:bg-accent/60"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <h3 className="mt-6 text-sm font-medium">Color</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => update(active, { color: c })}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    sel.color.toLowerCase() === c.toLowerCase()
                      ? "border-primary scale-110"
                      : "border-border"
                  }`}
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
              <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border text-xs text-muted-foreground">
                +
                <input
                  type="color"
                  value={sel.color}
                  onChange={(e) => update(active, { color: e.target.value })}
                  className="sr-only"
                />
              </label>
            </div>

            <h3 className="mt-6 text-sm font-medium">Shop {CATEGORY_LABELS[active].toLowerCase()}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {SHOPS[active].map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-sm transition hover:border-primary hover:bg-accent"
                >
                  {s.name} ↗
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function OutfitMannequin({ outfit }: { outfit: Outfit }) {
  const skin = "#f5d6c0";
  const hair = outfit.hair;
  const top = outfit.tops;
  const bottom = outfit.bottoms;
  const dress = outfit.dresses;
  const shoes = outfit.shoes;
  const bag = outfit.bags;
  const jewel = outfit.jewelry;
  const hasDress = dress.style !== "none";

  return (
    <svg viewBox="0 0 300 520" className="mx-auto h-[520px] w-full max-w-[360px]">
      {/* backdrop */}
      <defs>
        <radialGradient id="bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="oklch(0.97 0.05 330)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="300" height="520" fill="url(#bg)" />

      {/* Hair back */}
      <HairBack style={hair.style} color={hair.color} />

      {/* Head + neck */}
      <ellipse cx="150" cy="80" rx="34" ry="40" fill={skin} />
      <rect x="140" y="115" width="20" height="18" fill={skin} />

      {/* Jewelry necklace (behind body) */}
      {jewel.style !== "none" && (
        <Jewelry style={jewel.style} color={jewel.color} />
      )}

      {/* Body / outfit */}
      {hasDress ? (
        <Dress style={dress.style} color={dress.color} />
      ) : (
        <>
          <Top style={top.style} color={top.color} />
          <Bottom style={bottom.style} color={bottom.color} />
        </>
      )}

      {/* Legs */}
      <rect x="138" y="400" width="10" height="60" fill={skin} />
      <rect x="152" y="400" width="10" height="60" fill={skin} />

      {/* Shoes */}
      <Shoes style={shoes.style} color={shoes.color} />

      {/* Hair front */}
      <HairFront style={hair.style} color={hair.color} />

      {/* Face */}
      <circle cx="138" cy="80" r="2" fill="#3b2a1a" />
      <circle cx="162" cy="80" r="2" fill="#3b2a1a" />
      <path d="M142 95 Q150 100 158 95" stroke="#c44569" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Bag */}
      {bag.style !== "none" && <Bag style={bag.style} color={bag.color} />}
    </svg>
  );
}

function HairBack({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "long":
      return <path d="M105 70 Q100 200 120 300 L180 300 Q200 200 195 70 Q170 30 150 30 Q130 30 105 70 Z" fill={color} />;
    case "ponytail":
      return <path d="M115 70 Q110 110 120 130 L180 130 Q190 110 185 70 Z M178 90 Q230 130 215 220 Q205 250 195 220 Q200 150 178 110 Z" fill={color} />;
    case "curls":
      return <g fill={color}><circle cx="108" cy="80" r="22"/><circle cx="115" cy="120" r="20"/><circle cx="192" cy="80" r="22"/><circle cx="185" cy="120" r="20"/><circle cx="150" cy="45" r="28"/></g>;
    case "bob":
    default:
      return <path d="M110 70 Q108 130 118 145 L182 145 Q192 130 190 70 Q170 30 150 30 Q130 30 110 70 Z" fill={color} />;
  }
}

function HairFront({ style, color }: { style: string; color: string }) {
  if (style === "ponytail") {
    return <path d="M118 55 Q150 40 182 55 Q175 70 150 65 Q125 70 118 55 Z" fill={color} />;
  }
  return <path d="M118 60 Q140 45 152 65 Q160 50 182 60 Q180 75 150 72 Q120 75 118 60 Z" fill={color} />;
}

function Top({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "crop":
      return <path d="M105 135 L195 135 L205 180 L95 180 Z" fill={color} />;
    case "blouse":
      return <path d="M95 135 Q90 160 100 180 L90 240 L210 240 L200 180 Q210 160 205 135 L175 130 Q150 145 125 130 Z" fill={color} />;
    case "tank":
      return <path d="M125 135 L175 135 L195 250 L105 250 Z" fill={color} />;
    case "tee":
    default:
      return <path d="M105 135 L195 135 L215 175 L195 185 L195 250 L105 250 L105 185 L85 175 Z" fill={color} />;
  }
}

function Bottom({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "mini":
      return <path d="M105 250 L195 250 L210 310 L90 310 Z" fill={color} />;
    case "midi":
      return <path d="M105 250 L195 250 L220 400 L80 400 Z" fill={color} />;
    case "shorts":
      return <path d="M105 250 L195 250 L200 305 L155 305 L150 300 L145 305 L100 305 Z" fill={color} />;
    case "jeans":
    default:
      return <path d="M105 250 L195 250 L195 400 L155 400 L150 305 L145 400 L105 400 Z" fill={color} />;
  }
}

function Dress({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "aline":
      return <path d="M115 135 L185 135 L225 360 L75 360 Z" fill={color} />;
    case "gown":
      return <path d="M120 135 L180 135 L230 460 L70 460 Z" fill={color} />;
    case "slip":
    default:
      return <path d="M125 135 L175 135 L200 340 L100 340 Z" fill={color} />;
  }
}

function Shoes({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "heel":
      return <g fill={color}><path d="M128 460 L150 460 L148 470 L130 472 Z"/><path d="M152 460 L174 460 L172 472 L154 470 Z"/><rect x="146" y="470" width="2" height="10"/><rect x="154" y="470" width="2" height="10"/></g>;
    case "boot":
      return <g fill={color}><rect x="130" y="440" width="18" height="35" rx="3"/><rect x="152" y="440" width="18" height="35" rx="3"/><ellipse cx="139" cy="478" rx="12" ry="4"/><ellipse cx="161" cy="478" rx="12" ry="4"/></g>;
    case "flat":
      return <g fill={color}><ellipse cx="139" cy="468" rx="14" ry="6"/><ellipse cx="161" cy="468" rx="14" ry="6"/></g>;
    case "sneaker":
    default:
      return <g fill={color} stroke="#1a1a1a" strokeWidth="1"><rect x="125" y="458" width="26" height="14" rx="6"/><rect x="149" y="458" width="26" height="14" rx="6"/></g>;
  }
}

function Bag({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "tote":
      return <g fill={color}><rect x="210" y="260" width="40" height="50" rx="3"/><path d="M215 260 Q215 240 230 240 Q245 240 245 260" stroke={color} strokeWidth="3" fill="none"/></g>;
    case "clutch":
      return <g fill={color}><rect x="210" y="280" width="50" height="20" rx="4"/></g>;
    case "shoulder":
    default:
      return <g fill={color}><ellipse cx="230" cy="280" rx="22" ry="16"/><path d="M212 270 Q205 230 225 220" stroke={color} strokeWidth="2" fill="none"/></g>;
  }
}

function Jewelry({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "hoops":
      return <g fill="none" stroke={color} strokeWidth="2"><circle cx="118" cy="95" r="5"/><circle cx="182" cy="95" r="5"/></g>;
    case "pearls":
      return <g fill={color} stroke="#bbb" strokeWidth="0.5"><circle cx="135" cy="132" r="2.5"/><circle cx="143" cy="135" r="2.5"/><circle cx="150" cy="137" r="2.5"/><circle cx="157" cy="135" r="2.5"/><circle cx="165" cy="132" r="2.5"/></g>;
    case "chain":
    default:
      return <path d="M138 130 Q150 145 162 130" stroke={color} strokeWidth="2" fill="none" />;
  }
}