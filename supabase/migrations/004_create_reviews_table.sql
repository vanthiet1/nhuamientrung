-- Migration: Create Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast lookup by product and status
CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS product_reviews_status_idx ON product_reviews(status);

-- Enable RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a review (insert)
CREATE POLICY "Allow public insert on product_reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (true);

-- Allow public to view only approved reviews
CREATE POLICY "Allow public read approved reviews"
  ON product_reviews FOR SELECT
  USING (status = 'approved');

-- Allow authenticated admins to do everything
CREATE POLICY "Allow authenticated full access on product_reviews"
  ON product_reviews FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
