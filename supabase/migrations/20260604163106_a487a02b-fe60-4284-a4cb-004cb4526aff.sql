
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cat TEXT NOT NULL,
  shop TEXT NOT NULL,
  shop_url TEXT NOT NULL,
  name TEXT NOT NULL,
  price TEXT,
  img TEXT NOT NULL,
  url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cat, shop, img)
);

CREATE INDEX products_cat_shop_idx ON public.products (cat, shop, scraped_at DESC);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);
