# Database Column-Level Audit Report

This report details every column in the `enquiries` and `projects` tables, whether they are referenced by the frontend, services, or database triggers/SQL policies, and whether they are safe to remove.

---

## 1. Table: `enquiries`

| Column Name | Referenced by Frontend? | Referenced by Services? | Referenced by SQL? | Safe to Remove? | Comments / Rationale |
|---|---|---|---|---|---|
| `id` | Yes (37 files) | Yes (4 files) | Yes (6 files) | **No** | System columns, required for primary key and timestamps. |
| `project_name` | No | No | Yes (1 files) | **Yes** | Duplicate of `project_title`. Frontend and services now standardized to `project_title`. |
| `email` | Yes (13 files) | Yes (2 files) | Yes (3 files) | **No** | Actively referenced in application. |
| `message` | Yes (22 files) | Yes (1 files) | No | **No** | Actively referenced in application. |
| `status` | Yes (23 files) | Yes (1 files) | Yes (3 files) | **No** | Actively referenced in application. |
| `created_at` | Yes (4 files) | No | Yes (2 files) | **No** | System columns, required for primary key and timestamps. |
| `updated_at` | Yes (1 files) | Yes (2 files) | Yes (3 files) | **No** | System columns, required for primary key and timestamps. |
| `project_id` | Yes (1 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `project_title` | Yes (1 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `customer_name` | Yes (1 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `mobile_number` | Yes (1 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `price` | Yes (14 files) | No | No | **No** | Actively referenced in application. |
| `notes` | Yes (6 files) | No | No | **No** | Actively referenced in application. |

---

## 2. Table: `projects`

| Column Name | Referenced by Frontend? | Referenced by Services? | Referenced by SQL? | Safe to Remove? | Comments / Rationale |
|---|---|---|---|---|---|
| `id` | Yes (37 files) | Yes (4 files) | Yes (6 files) | **No** | System columns, required for primary key and timestamps. |
| `title` | Yes (37 files) | Yes (1 files) | No | **No** | Actively referenced in application. |
| `slug` | Yes (10 files) | Yes (1 files) | No | **No** | Actively referenced in application. |
| `short_description` | No | No | Yes (1 files) | **No** | Actively referenced in application. |
| `category` | Yes (15 files) | Yes (1 files) | No | **No** | Actively referenced in application. |
| `level` | Yes (5 files) | No | Yes (1 files) | **Yes** | Duplicate of `project_level`. frontend uses `project_level`. |
| `difficulty` | Yes (9 files) | No | No | **No** | Actively referenced in application. |
| `price` | Yes (14 files) | No | No | **No** | Actively referenced in application. |
| `status` | Yes (23 files) | Yes (1 files) | Yes (3 files) | **No** | Actively referenced in application. |
| `featured` | Yes (8 files) | Yes (1 files) | No | **No** | Actively referenced in application. |
| `created_at` | Yes (4 files) | No | Yes (2 files) | **No** | System columns, required for primary key and timestamps. |
| `updated_at` | Yes (1 files) | Yes (2 files) | Yes (3 files) | **No** | System columns, required for primary key and timestamps. |
| `description` | Yes (26 files) | No | Yes (1 files) | **Yes** | Duplicate of `short_description` / `full_description`. |
| `full_description` | Yes (2 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `currency` | Yes (8 files) | No | No | **No** | Actively referenced in application. |
| `project_level` | Yes (2 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `technology` | Yes (7 files) | No | No | **No** | Actively referenced in application. |
| `build_time` | Yes (2 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `features` | Yes (7 files) | No | No | **No** | Actively referenced in application. |
| `badge` | Yes (12 files) | No | No | **No** | Actively referenced in application. |
| `search_keywords` | Yes (1 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `images` | Yes (6 files) | Yes (1 files) | Yes (3 files) | **No** | Actively referenced in application. |
| `video_url` | Yes (1 files) | No | Yes (2 files) | **No** | Actively referenced in application. |
| `resources` | Yes (7 files) | No | No | **No** | Actively referenced in application. |
| `components` | Yes (31 files) | No | No | **No** | Actively referenced in application. |
| `specifications` | Yes (6 files) | No | No | **No** | Actively referenced in application. |
| `reviews` | Yes (2 files) | Yes (1 files) | No | **No** | Actively referenced in application. |
| `related_projects` | Yes (1 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `stock_status` | Yes (2 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `downloads` | Yes (2 files) | Yes (1 files) | Yes (2 files) | **No** | Actively referenced in application. |
| `aiTrainingReferences` | No | No | Yes (1 files) | **Yes (Migrate)** | Currently camelCase in DB. Needs to be migrated to snake_case (`ai_training_references`). |
| `how_it_works` | Yes (2 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `applications` | Yes (5 files) | No | No | **No** | Actively referenced in application. |
| `benefits` | Yes (5 files) | No | No | **No** | Actively referenced in application. |
| `estimated_delivery` | Yes (2 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `whatsapp_number` | Yes (3 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `last_updated` | Yes (1 files) | No | Yes (1 files) | **No** | Actively referenced in application. |
| `variants` | Yes (5 files) | No | No | **No** | Actively referenced in application. |
