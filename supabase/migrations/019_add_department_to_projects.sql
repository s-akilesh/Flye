-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 019: ADD DEPARTMENT TO PROJECTS
-- ========================================================================
-- This migration adds the department column to the projects table, allowing
-- projects to be categorized by engineering department or lab divisions.
-- ========================================================================

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS department TEXT;
