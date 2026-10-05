-- Migration: 038_align_reviews_schema.sql
-- Description: Align reviews table schema with the 4 core review details:
-- 1. rating (Integer 1-5)
-- 2. name (Customer full name)
-- 3. email (Optional contact email)
-- 4. project / service (Product or Service: '3D Printing', 'Project', '3D Printing & Project')
-- 5. comment (Detailed description & review)
-- 6. avatar_url (Attached image URL)

-- Ensure columns exist and constraints match
ALTER TABLE public.reviews
    ALTER COLUMN role DROP NOT NULL,
    ALTER COLUMN institution DROP NOT NULL;

-- Clean existing mock roles & institutions from seed rows
UPDATE public.reviews
SET role = NULL,
    institution = NULL;

-- Standardize seed reviews project tags to exact service options
UPDATE public.reviews
SET project = 'Project', category = 'Electronics Kit'
WHERE name = 'Akash Sharma';

UPDATE public.reviews
SET project = '3D Printing', category = '3D Printing'
WHERE name = 'Sneha Reddy';

UPDATE public.reviews
SET project = '3D Printing & Project', category = 'Electronics Kit'
WHERE name = 'Vikram Patel';

UPDATE public.reviews
SET project = '3D Printing', category = '3D Printing'
WHERE name = 'Pooja Nair';

UPDATE public.reviews
SET project = 'Project', category = 'Electronics Kit'
WHERE name = 'Karthik Verma';
