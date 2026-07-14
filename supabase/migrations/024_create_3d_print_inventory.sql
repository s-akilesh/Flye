-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 024: 3D PRINT INVENTORY MASTER DATA & TABLES
-- ========================================================================

-- 1. Insert seed values for 3D printing master data categories
INSERT INTO public.master_data (type, key, value, display_order)
VALUES 
    ('3d_print_category', 'prototypes', 'Prototypes', 10),
    ('3d_print_category', 'educational', 'Educational Kits', 20),
    ('3d_print_category', 'art-decor', 'Art & Decor', 30),
    ('3d_print_category', 'mechanical', 'Mechanical Parts', 40)
ON CONFLICT (type, key) DO UPDATE 
SET value = EXCLUDED.value, display_order = EXCLUDED.display_order;

-- 2. Insert seed values for 3D printing master data materials
INSERT INTO public.master_data (type, key, value, display_order)
VALUES 
    ('3d_print_material', 'pla', 'PLA', 10),
    ('3d_print_material', 'abs', 'ABS', 20),
    ('3d_print_material', 'petg', 'PETG', 30),
    ('3d_print_material', 'tpu', 'TPU (Flexible)', 40),
    ('3d_print_material', 'resin', 'Resin', 50)
ON CONFLICT (type, key) DO UPDATE 
SET value = EXCLUDED.value, display_order = EXCLUDED.display_order;

-- 3. Create 3D Print Products table (double-quoted because it starts with a number)
CREATE TABLE IF NOT EXISTS public."3d_print_products" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- foreign reference to master_data '3d_print_category' values
    material TEXT, -- foreign reference to master_data '3d_print_material' values
    color TEXT,
    weight NUMERIC, -- weight in grams
    dimensions TEXT, -- "L x W x H mm"
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 5,
    price NUMERIC DEFAULT 0.0,
    contact_for_price BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active', -- 'active' | 'archived' | 'out_of_stock'
    visibility TEXT DEFAULT 'Draft', -- 'Published' | 'Draft'
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb, -- Future variants, suppliers, and transactional data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Product Images table for multiple images (double-quoted because it starts with a number)
CREATE TABLE IF NOT EXISTS public."3d_print_product_images" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public."3d_print_products"(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public."3d_print_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."3d_print_product_images" ENABLE ROW LEVEL SECURITY;

-- 6. RLS Select policies (Allow all public users to view)
DROP POLICY IF EXISTS "Allow public read access on 3d_print_products" ON public."3d_print_products";
CREATE POLICY "Allow public read access on 3d_print_products" ON public."3d_print_products"
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on 3d_print_product_images" ON public."3d_print_product_images";
CREATE POLICY "Allow public read access on 3d_print_product_images" ON public."3d_print_product_images"
    FOR SELECT USING (true);

-- 7. RLS Write policies (Restrict full access to admin/super_admin users)
DROP POLICY IF EXISTS "Allow admin full access on 3d_print_products" ON public."3d_print_products";
CREATE POLICY "Allow admin full access on 3d_print_products" ON public."3d_print_products"
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Allow admin full access on 3d_print_product_images" ON public."3d_print_product_images";
CREATE POLICY "Allow admin full access on 3d_print_product_images" ON public."3d_print_product_images"
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    );
