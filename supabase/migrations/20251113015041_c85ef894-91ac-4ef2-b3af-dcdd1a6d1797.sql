-- Create storage bucket for customer logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('customer-logos', 'customer-logos', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for customer-logos bucket
CREATE POLICY "Users can upload their own logos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'customer-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own logos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'customer-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all logos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'customer-logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add logo_url column to cart_items
ALTER TABLE public.cart_items
ADD COLUMN IF NOT EXISTS logo_url text;

-- Add logo_url and custom_text columns to order_items
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS custom_text text;