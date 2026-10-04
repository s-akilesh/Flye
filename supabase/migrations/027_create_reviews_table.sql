-- Migration: 027_create_reviews_table.sql
-- Description: Create reviews table for user feedback and customer testimonials

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(255),
    institution VARCHAR(255),
    project VARCHAR(255),
    category VARCHAR(100) DEFAULT 'General',
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    avatar_url TEXT,
    avatar_bg VARCHAR(50) DEFAULT '#0d9488',
    avatar_text VARCHAR(10),
    status VARCHAR(50) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    show_in_home BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for rapid queries
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_show_in_home ON public.reviews(show_in_home);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Anyone (including anonymous public users) can submit reviews
DROP POLICY IF EXISTS "Public can submit reviews" ON public.reviews;
CREATE POLICY "Public can submit reviews"
    ON public.reviews
    FOR INSERT
    WITH CHECK (true);

-- 2. Anyone can read approved reviews that are active
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews"
    ON public.reviews
    FOR SELECT
    USING (is_active = true AND status = 'approved');

-- 3. Authenticated admins have full management permissions
DROP POLICY IF EXISTS "Admins have full access to reviews" ON public.reviews;
CREATE POLICY "Admins have full access to reviews"
    ON public.reviews
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Seed initial maker reviews
INSERT INTO public.reviews (name, role, institution, project, category, rating, comment, avatar_text, avatar_bg, status, show_in_home)
VALUES 
    ('Akash Sharma', 'Final Year Mechatronics', 'IIT Madras', 'Autonomous Rover Kit', 'Electronics Kit', 5, 'The hardware was 100% pre-tested and ready to run. Every motor driver and sensor worked out of the box with the provided schematics. Helped our team secure top marks in our capstone review!', 'AS', '#0d9488', 'approved', true),
    ('Sneha Reddy', 'IoT Developer & Researcher', 'Anna University', 'Custom Drone Chassis', '3D Printing', 5, 'Got our custom drone chassis and sensor brackets 3D printed with 0.1mm layer tolerance. The PETG parts arrived within 48 hours and fit our brushless motors flawlessly.', 'SR', '#f97316', 'approved', true),
    ('Vikram Patel', 'Robotics Team Lead', 'SRM Tech Team', 'Industrial IoT Edge Node', 'Electronics Kit', 5, 'Flyen saved us weeks of component sourcing and debugging. The live debug guidance from their hardware mentors was invaluable when calibrating our ESP32 gateway.', 'VP', '#3b82f6', 'approved', true),
    ('Pooja Nair', 'Maker & Product Designer', 'Bengaluru', 'Custom Batch 3D Prints', '3D Printing', 5, 'Ordered 15 personalized engraved keepsake boxes for our tech fest. The print precision, surface finish, and snap-fit hinges exceeded everyone''s expectations.', 'PN', '#8b5cf6', 'approved', true),
    ('Karthik Verma', 'EEE Project Lead', 'NIT Trichy', 'Solar Energy Monitor Kit', 'Electronics Kit', 5, 'The Smart Solar MPPT Tracking package came with clean documentation and complete wiring guides. Highly recommended for students who want industrial-standard hardware!', 'KV', '#10b981', 'approved', true)
ON CONFLICT DO NOTHING;
