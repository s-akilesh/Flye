# Flyen Platform - System Architecture

This document describes the high-level design, routing paths, styling parameters, and component organization for the Flyen React platform.

---

## Directory Layout & Design System

The application conforms to a standard Vite+React single-page architecture (SPA) designed to build scalable engineering portals:

* **Entry Points**: 
  - `index.html` (Vite entry)
  - `src/main.jsx` (Application bootstrap)
  - `src/App.jsx` (Context loading, route nesting)
* **Modular Style Sheets**: Located in `src/styles/`. Centralizes visual rules so styles can be adjusted without changing component structure.
* **Component Hierarchies**: Mapped into atomic subdivisions:
  - `components/ui/`: Atomic elements (buttons, chips, ranges, modals).
  - `components/layout/`: Common layouts (header navigation, filtering sidebar drawer, glow overlays).
  - `components/sections/`: Mid-level sections (Hero, navigation deck, project details, package checklist).

---

## State Management

To support future additions (Cart, AI, User Accounts, etc.) without requiring major code refactoring, the project includes lightweight state placeholder contexts:

1. **CartContext**: Manages orders and custom printing requests.
2. **CompareContext**: Prepares for multi-project comparison panels.
3. **AIContext**: Configures natural language prompts and regex parses.
4. **UserContext**: Sets up placeholders for login states.
5. **WishlistContext**: Configures bookmarks for favorite kits.

Components reference these contexts using simple custom hooks or hooks bindings, ensuring state layers can be upgraded (e.g. to Redux or Zustand) in the future if required.
