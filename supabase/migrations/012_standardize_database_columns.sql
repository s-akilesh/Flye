-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 012: STANDARDIZE DATABASE COLUMNS (SNAKE_CASE)
-- ========================================================================
-- This migration standardizes naming conventions in the database to be
-- strictly snake_case, drops legacy unused columns, and prepares the schema
-- for modular feature development.
-- ========================================================================

-- 1. Standardize enquiries table
ALTER TABLE public.enquiries 
  DROP COLUMN IF EXISTS project_id,
  DROP COLUMN IF EXISTS project_name,
  DROP COLUMN IF EXISTS customer_name,
  DROP COLUMN IF EXISTS mobile_number,
  DROP COLUMN IF EXISTS "createdAt",
  DROP COLUMN IF EXISTS "updatedAt";

ALTER TABLE public.enquiries RENAME COLUMN "projectId" TO project_id;
ALTER TABLE public.enquiries RENAME COLUMN "projectTitle" TO project_title;
ALTER TABLE public.enquiries RENAME COLUMN name TO customer_name;
ALTER TABLE public.enquiries RENAME COLUMN mobile TO mobile_number;


-- 2. Standardize projects table
ALTER TABLE public.projects
  DROP COLUMN IF EXISTS short_description,
  DROP COLUMN IF EXISTS full_description,
  DROP COLUMN IF EXISTS level,
  DROP COLUMN IF EXISTS "aiTrainingReferences";

ALTER TABLE public.projects RENAME COLUMN "fullDescription" TO full_description;
ALTER TABLE public.projects RENAME COLUMN "projectLevel" TO project_level;
ALTER TABLE public.projects RENAME COLUMN "buildTime" TO build_time;
ALTER TABLE public.projects RENAME COLUMN "searchKeywords" TO search_keywords;
ALTER TABLE public.projects RENAME COLUMN "videoUrl" TO video_url;
ALTER TABLE public.projects RENAME COLUMN "relatedProjects" TO related_projects;
ALTER TABLE public.projects RENAME COLUMN "stockStatus" TO stock_status;
ALTER TABLE public.projects RENAME COLUMN "howItWorks" TO how_it_works;
ALTER TABLE public.projects RENAME COLUMN "estimatedDelivery" TO estimated_delivery;
ALTER TABLE public.projects RENAME COLUMN "whatsappNumber" TO whatsapp_number;
ALTER TABLE public.projects RENAME COLUMN "lastUpdated" TO last_updated;
