-- Add support for multiple images and detailed dimensions
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{}';

-- Create an index for better performance on images array
CREATE INDEX IF NOT EXISTS idx_products_images ON public.products USING GIN(images);

-- Update existing products to move single image to images array
UPDATE public.products 
SET images = ARRAY[image]
WHERE images = '{}' AND image IS NOT NULL AND image != '';