# Flyen Platform - Component Library

This document outlines components developed inside the Flyen platform and summarizes their responsibilities.

---

## 1. UI Components (`src/components/ui/`)

* **Button**:
  - Handles custom classes (`.btn-submit-calc`, `.btn-terminal-submit`, `.btn-back`, `.btn-ai-toggle`).
  - Supports standard properties (disabled state, click events, type tags).
* **Card**:
  - Provides a stylized glass container (`.card-glass`) utilizing local HSL glows, borders, and CSS drop-shadow filters.
* **Chip**:
  - Wraps filters (`.chip-filter`), custom categories, and hardware tags (`.component-chip-node`).
* **Badge**:
  - Highlights project difficulty tiers and recommended kits tags.
* **Input**:
  - Standardizes search inputs, fields for forms, and infill range sliders.
* **Dropdown**:
  - Stylizes selecting parameters (`.sort-select`).
* **Modal**:
  - Configures common glass-backed overlays for receipts and natural language search boxes.

---

## 2. Layout Components (`src/components/layout/`)

* **Header**:
  - Displays Logo, navigation tags, and back buttons, responding to routers.
* **Sidebar**:
  - Manages categories, difficulties, and feature filters. Renders as a fixed sidebar on desktop and a slide-up drawer on mobile.
* **SearchPanel**:
  - Collects query items, sorting options, and triggers the AI Finder Modal.
* **GlowBackground**:
  - Controls layered drifting background glows.
* **MainLayout**:
  - Wraps routing routes inside common navigation and floating contact docks.

---

## 3. Section Components (`src/components/sections/`)

* **Hero**:
  - Main landing banner with rotating header text.
* **NavigationCards**:
  - Gateway panels linking pages with mouse-tilt operations.
* **KPISection**:
  - Floating metric summary cards.
* **ContactChips**:
  - Floating contact nodes (WhatsApp, Call Us, mail, address).
* **ProjectGrid**:
  - Controls responsive mapping of projects listings.
* **RelatedProjects**:
  - Recommends related items matching categories.
* **ProjectOverview**:
  - Detail overview logs (objectives, operations, applications, package inclusions).
