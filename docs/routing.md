# Flyen Platform - Routing Configuration

This document lists the routes managed by React Router inside the Flyen application.

---

## Centralized Routing Constants

All routes are defined as constants inside `src/constants/routes.js` to ensure uniform referencing across headers, cards, and pages.

| Route Constant | Path Path | Target View |
| :--- | :--- | :--- |
| `ROUTES.HOME` | `/` | Home Landing Gateway |
| `ROUTES.PROJECTS` | `/projects` | Marketplace discovery grid |
| `ROUTES.PROJECT_DETAILS` | `/project/:slug` | In-depth engineering detail sheet |
| `ROUTES.PRINTING` | `/printing` | 3D printing calculator & catalog |
| `ROUTES.VIDEOS` | `/videos` | Learning tutorial playlist & consultation |
| `ROUTES.CONTACT` | `/contact` | Dedicated contacts portal |

---

## Animated Page Transitions

Vite loads the router configured with Framer Motion to handle page transitions:
1. **AnimatePresence**: Keeps active page components mounted during exit phases.
2. **Page Transitions**: Wraps page containers in Framer Motion `<motion.div>` configurations:
   * **Enter**: Fades in and slides up (`opacity: 1`, `y: 0`).
   * **Exit**: Fades out and slides down (`opacity: 0`, `y: 15px`).
   * **Transition Speed**: Configured to match the approved transition speed (`0.4s` duration with custom ease curves).
