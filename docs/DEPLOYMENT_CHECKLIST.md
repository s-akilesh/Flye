# Flyen Deployment Playbook & Production Checklist

This document is the official deployment guide and quality assurance checklist for the Flyen platform. Every feature release and hotfix must satisfy the checks outlined below before being promoted to the Production environment.

---

## 1. Deployment Workflow

The Flyen release lifecycle follows a structured progression to ensure stability and minimize downtime:

```
[Local Development] 
       │ (Code & local testing)
       ▼
[Flyen Dev Supabase] 
       │ (Feature integration & staging schema testing)
       ▼
[Testing & QA] 
       │ (Manual verification of UI and storage flows)
       ▼
[GitHub Feature Branch] 
       │ (Atomic commits on feature/* or bugfix/* branches)
       ▼
[Pull Request] 
       │ (Peer review & automated build verification)
       ▼
[Merge into Main] 
       │ (Continuous integration trigger)
       ▼
[Flyen Production Supabase] 
       │ (Migration scripts run & schema synced)
       ▼
[Vercel Production Deployment] 
       │ (Production build triggered on main branch)
       ▼
[Production Verification] 
       │ (Smoke tests & final QA checklist)
```

### Stage Definitions
1. **Local Development**: Features are built locally using a local development server (`npm run dev`) and tested against the Development Supabase instance.
2. **Flyen Dev Supabase**: Staging database where schema changes are prototyped and storage buckets are tested.
3. **Testing & QA**: Active verification of the feature against the Dev environment.
4. **GitHub Feature Branch**: Isolated git branches named `feature/name` or `bugfix/issue`.
5. **Pull Request**: Formal code review. Code must build successfully.
6. **Merge into Main**: Main branch represents the release candidate.
7. **Flyen Production Supabase**: Production database. Migrations are executed prior to deployment.
8. **Vercel Production Deployment**: Deployment hosted on Vercel, pointing to the Production database.
9. **Production Verification**: Verification steps performed on the live production site.

---

## 2. Pre-Deployment Checklist

Before merging any pull request into the `main` branch, verify the following:

- [ ] **Build Check**: `npm run build` completes successfully on a local machine.
- [ ] **Lint/Type Check**: No syntax, compiler, or linter warnings.
- [ ] **Zero Console Logs**: No active `console.log`, `console.table`, or `console.debug` statements remain (except inside `logger.js`).
- [ ] **No Code Comments**: All `TODO`, `FIXME`, or commented-out legacy code blocks are removed.
- [ ] **Dead Code Audit**: No unused imports, unused variables, or dead components remain.
- [ ] **Responsive Design**: All layout views verified on Mobile, Tablet, Laptop, and Desktop viewports.
- [ ] **Environment Variables**: Local `.env` verified and not committed to the repository.

---

## 3. Database Checklist

Whenever a feature introduces database changes (tables, columns, triggers, or functions), verify the following:

- [ ] New tables are created in the target database.
- [ ] New columns, foreign keys, and constraints are applied.
- [ ] Database indexes are created on columns frequently used in `where` or `join` clauses.
- [ ] Default values are verified.
- [ ] Seed data or lookup records are populated.

### Database Change Log
Use this table to log schema changes:

| Feature Name | Migration Date | Database Changes (SQL Summary) | Executed By |
| :--- | :--- | :--- | :--- |
| Settings Migration | 2026-06-28 | Created `settings` table with columns for branding, contact, and email. | Antigravity |

---

## 4. Row Level Security (RLS)

Every table in Supabase must have Row Level Security enabled. Verify the following policies:

- [ ] **SELECT Policy**: Configured to restrict or allow public reads.
- [ ] **INSERT Policy**: Restricted to authenticated users or admins.
- [ ] **UPDATE Policy**: Restricted to authorized users (e.g. comparing user ID or checking admin role).
- [ ] **DELETE Policy**: Restricted to admins.

Verify RLS policies exist in both environments:
- **Development**: [ ] Verified
- **Production**: [ ] Verified

---

## 5. Storage Checklist

Verify that the required storage buckets exist in both environments with correct access levels:

### Public Buckets (Read access allowed for everyone)
- `logos`: [ ] Dev | [ ] Prod
- `favicons`: [ ] Dev | [ ] Prod
- `profiles`: [ ] Dev | [ ] Prod
- `website-assets`: [ ] Dev | [ ] Prod
- `project-images`: [ ] Dev | [ ] Prod
- `learning-images`: [ ] Dev | [ ] Prod

### Private Buckets (Read access requires signed URLs)
- `project-documents`: [ ] Dev | [ ] Prod
- `project-videos`: [ ] Dev | [ ] Prod
- `downloads`: [ ] Dev | [ ] Prod
- `temporary`: [ ] Dev | [ ] Prod

---

## 6. Authentication Checklist

Verify the Supabase Auth configuration:

- [ ] **Redirect URLs**: Configured to match the production domain (e.g. `https://yourdomain.com/auth/callback`) in the production dashboard.
- [ ] **Allowed Origins**: CORS settings configured correctly.
- [ ] **Email Templates**: Invitation, confirmation, and password reset email templates verified.
- [ ] **Session Handling**: Token expiration and refresh token flows verified.

---

## 7. Environment Variables

Verify that the following environment variables are configured in the deployment platform (Vercel):

### Development / Staging
- `VITE_SUPABASE_URL` (Staging URL)
- `VITE_SUPABASE_ANON_KEY` (Staging Anon Key)

### Production
- `VITE_SUPABASE_URL` (Production URL)
- `VITE_SUPABASE_ANON_KEY` (Production Anon Key)

*Never expose or commit `.env` files to Git.*

---

## 8. Vercel Deployment

Before declaring a release successful on Vercel, verify:

- [ ] The latest commit from `main` is deployed.
- [ ] Environment variables are synced and active.
- [ ] The build logs contain no warnings or errors.
- [ ] Custom domain names are connected and active.
- [ ] SSL/TLS certificate is active and secure (`https://`).

---

## 9. Manual QA Checklist

Perform these smoke tests on the live deployment:

### General
- [ ] Home page loads successfully.
- [ ] Header and Footer render correct branding.
- [ ] Mobile navigation drawer opens and closes.

### Authentication
- [ ] Admin login succeeds with valid credentials.
- [ ] Access is blocked on `/admin/*` routes when logged out.
- [ ] Logout succeeds, clearing the session and redirecting.

### Settings & Uploads
- [ ] Branding settings load, save, and update the Header logo immediately.
- [ ] Profile photo uploads to `profiles` bucket and replaces the old file.
- [ ] Favicon uploads to `favicons` bucket and swaps the browser tab icon.

---

## 10. Release Notes

*Template for documenting releases:*

```
Version: v1.1.0
Release Date: 2026-06-28
Features Added:
  - Settings Supabase Migration (localStorage removed)
  - Centralized Storage Service (Image upload & replacement)
Bug Fixes:
  - Fixed mobile drawer role switching navigation
Database Changes:
  - Created settings table (id, website_name, website_tagline, logo_url, etc.)
Storage Changes:
  - Configured logos, favicons, and profiles buckets
Known Issues: None
```

---

## 11. Rollback Plan

If a production deployment fails, execute these rollback procedures immediately:

1. **Revert Vercel**: redeploy the previous successful deployment in the Vercel dashboard.
2. **Revert Git**: Revert the last commit on `main` using `git revert` if necessary.
3. **Database Restore**: If schema changes caused data loss, restore the database from the last automated daily backup.
4. **Verify Health**: Confirm that authentication, storage, and core pages are fully operational.

---

## 12. Future Improvements

A list of future infrastructure improvements:
* [ ] Integrate **Supabase CLI** for automated database migrations.
* [ ] Setup **GitHub Actions** for CI/CD (lint, test, build, deploy).
* [ ] Integrate **Sentry** for real-time error reporting and performance monitoring.
* [ ] Implement automated daily database backups.
