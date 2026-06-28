# Flyen Supabase Migrations & Storage Schema

This directory contains the SQL migration scripts and storage bucket documentation for the Flyen platform.

---

## 1. Directory Structure

```text
supabase/
├── migrations/
│      001_settings_table.sql       # Schema for the platform settings table
│      002_settings_rls.sql         # Row Level Security policies for the settings table
│      003_storage_policies.sql     # Row Level Security policies for Storage buckets (objects and buckets)
│
└── storage/
       bucket_structure.md          # Documentation on bucket folders and naming conventions
```

---

## 2. Running Migrations

To set up a new development or production instance of the Flyen backend, execute the scripts in order in the **Supabase SQL Editor**:

1. Run [001_settings_table.sql](file:///c:/Users/Akilesh/Documents/Flyen/supabase/migrations/001_settings_table.sql) to create the settings table.
2. Run [002_settings_rls.sql](file:///c:/Users/Akilesh/Documents/Flyen/supabase/migrations/002_settings_rls.sql) to enable Row Level Security on the settings table.
3. Run [003_storage_policies.sql](file:///c:/Users/Akilesh/Documents/Flyen/supabase/migrations/003_storage_policies.sql) to configure access policies on the storage buckets.

---

## 3. Storage Buckets Setup

Before running the storage policies, make sure the following buckets are created in your Supabase storage console:

### Public Buckets
* `logos`
* `favicons`
* `profiles`
* `website-assets`
* `project-images`
* `learning-images`

### Private Buckets
* `project-documents`
* `project-videos`
* `downloads`
* `temporary`
