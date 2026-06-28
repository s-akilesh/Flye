# Flyen Storage Bucket Structure

This document outlines the organization and permissions for Flyen's Supabase Storage buckets.

---

## 1. Public Buckets
*Read access is open to everyone (anonymous guests and students). Write/Delete access is restricted to authenticated administrators.*

### `logos`
Stores branding logos for the platform.
* **Folder**: `website/`
* **Naming**: `website-logo-[timestamp].[ext]`

### `favicons`
Stores browser tab icons.
* **Folder**: `website/`
* **Naming**: `favicon-[timestamp].[ext]`

### `profiles`
Stores user profile pictures and avatars.
* **Folder**: `admin/`, `students/`
* **Naming**: `profile-photo-[timestamp].[ext]`

### `website-assets`
General public assets (banners, icons, illustration SVG files).

### `project-images`
Thumbnails and gallery slideshow images for DIY projects.
* **Folder**: `[project-slug]/`
* **Naming**: `thumbnail.webp`, `gallery-1.webp`

### `learning-images`
Diagrams and illustrations for the progressive learning stages.
* **Folder**: `[component-slug]/`

---

## 2. Private Buckets
*Read, Write, and Delete access are completely restricted to authenticated administrators. Anonymous users can only access these files using short-lived signed URLs generated dynamically by the application.*

### `project-documents`
Instructional PDFs, datasheets, and schematics for projects.
* **Folder**: `[project-slug]/`

### `project-videos`
Assembled video walkthroughs and component step-by-step guides.

### `downloads`
Downloadable assets (CAD models, source code ZIP archives, worksheets).

### `temporary`
Transient files, uploads in progress, or report exports.
