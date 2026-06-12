# Frontend Architecture & Code Review Guide

Purpose

- Provide an at-a-glance reference for the frontend app structure, tech choices, and conventions.
- Give a step-by-step checklist reviewers can follow to inspect code areas one-by-one.

Quick start

- Dev server: `cd frontend && npm install && npm run dev`
- Build: `cd frontend && npm run build`
- Preview: `cd frontend && npm run preview` (if configured)

Tech stack

- React (Vite)
- Tailwind CSS for styling
- Framer Motion for animations
- lucide-react icons
- axios (via `shared/services/api`) for HTTP
- socket.io-client for realtime interactions

High-level structure

- `src/`
  - `App.jsx` / `main.jsx` — app entry, router mount.
  - `admin-manager/` — the admin SPA (protected routes, CMS, dashboard, backup, notifications).
    - `authentication/` — `AuthContext`, `LoginPage`, guards.
    - `layout/` — `Sidebar`, `Navbar`, global admin shell.
    - `backup-management/`, `notifications/`, `user-management/`, etc. — feature pages.
  - `public-portfolio/` — the public-facing portfolio pages and sections.
  - `shared/` — utilities used across admin/public surfaces:
    - `services/` — API wrappers (e.g., `api.js`, `backupService.js`, `notificationService.js`).
    - `context/` — `SocketContext.jsx` and other global contexts.
    - `components/` — generic UI components and small primitives.
    - `hooks/` — reusable hooks.

Key files to review first

- `src/admin-manager/authentication/AuthContext.jsx` — auth flow, token storage, `setAuth`, `setUserData`.
- `src/shared/services/api.js` — axios instance, interceptors, base URL, credentials.
- `src/shared/context/SocketContext.jsx` — socket connection lifecycle and reconnection logic.
- `src/admin-manager/dashboard/Dashboard.jsx` — large container, greeting, stats fetching.
- `src/admin-manager/backup-management/Backup.jsx` — backup CRUD flow and file uploads.
- `src/public-portfolio/pages/` — hero, projects, about — component rendering patterns.

Conventions & patterns

- State: Prefer local component state for ephemeral UI; use contexts for auth and socket state.
- Data fetching: Use `shared/services/*` wrappers (return the raw `data` object). Handle `401/403` centrally in `api` interceptors.
- Form handling: Prefer controlled components and helper utilities from `shared/utils` when present.
- Styling: Use Tailwind utility classes. For dark-mode consistency use `dark:bg-black` and `dark:bg-neutral-900` for canvas and `dark:border-neutral-800` for borders.
- Icons: Use `lucide-react` consistently; import only the icons used in a file to keep bundle small.
- Access control: Routes under `admin-manager` use `AuthContext` and `ProtectedRoute` patterns.

Code review checklist (walk this list file/folder by file/folder)

1. Boot & Dev

- Can the project start (`npm run dev`) without errors? Ports are configurable.

2. Entry & routing

- `main.jsx` / `App.jsx`: Router setup, top-level error boundaries, providers.

3. Authentication

- `AuthContext`: token storage, cookie vs localStorage usage, `checkAuthUser` behavior, error handling.
- Login flow: Google sign-in handling, ID token POST to backend, error messages.

4. API layer

- `shared/services/api.js`: baseURL, credentials, interceptors for token refresh, global error handling.

5. Socket & realtime

- `SocketContext.jsx`: ensure socket connects only when authenticated, cleanup on logout, reconnection strategy.

6. Component design

- Components should be small and focused; large pages should break down into subcomponents.
- Look for repeated code that could be extracted to `shared/components` or hooks.

7. Error handling

- Network errors surfaced to users via toasts and not via uncaught exceptions.
- Defensive checks before property access (e.g., `obj?.prop`) to avoid runtime crashes.

8. Accessibility

- Buttons/inputs have proper `aria` attributes where needed.
- Interactive elements are reachable by keyboard and use semantic HTML.

9. Performance

- Avoid unnecessary rerenders: memoize expensive components or values (`useMemo`, `useCallback`).
- Large lists use pagination or virtualization where appropriate.

10. Styling & Theme

- Consistent dark-mode tokens (`dark:bg-black` for canvas, `dark:bg-neutral-900` for cards).
- No inline hex colors left in dark mode — prefer Tailwind tokens.

11. Security

- No secrets in frontend code. `VITE_` env vars are read-only and only safe values.
- Validate user inputs before sending to backend.

12. Tests & docs

- Are there unit tests or storybook stories for key components? If not, list priorities.

Suggested review order (one-by-one)

1. `src/admin-manager/authentication/AuthContext.jsx`
2. `src/shared/services/api.js` and `shared/services/*` wrappers
3. `src/shared/context/SocketContext.jsx`
4. `src/admin-manager/layout/*` (Navbar, Sidebar)
5. `src/admin-manager/dashboard/Dashboard.jsx`
6. `src/admin-manager/backup-management/Backup.jsx`
7. `src/admin-manager/notifications/*`
8. `src/public-portfolio/pages/*` (Hero, Projects, About, Contact)
9. `src/shared/components/*` and `src/shared/hooks/*`

Checklist to sign off a file

- Runs locally with no console errors.
- Lints cleanly (if linting configured).
- No uncaught exceptions in UI when exercising edge cases.
- Proper loading & error states.
- Responsive at common breakpoints.
- Accessible (aria, keyboard navigation).

How to document findings

- Create a short issue per finding with: file path, line snippet, description, severity (blocker/major/minor), suggested fix.
- Use PRs to fix each category (e.g., `fix(backup): defensive checks for create backup response`).

Follow-ups I can help with

- Run a quick sweep and create issues for any runtime errors (console traces you paste).
- Create an automated checklist (GitHub issue template) to run before merging PRs.

Document history

- Created: 2026-06-12
- Author: Team review helper
