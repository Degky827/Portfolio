# Frontend Architecture Documentation

## 1. Project Overview

### Purpose

This frontend powers a personal portfolio website and its admin panel. It provides two primary audiences:

- **Public visitors** — browse projects, skills, about page, contact form
- **Admin users** — manage content, view analytics, configure the system, create backups, and receive live inbox notifications

### Technologies

| Technology       | Role                                     |
| ---------------- | ---------------------------------------- |
| React            | UI library for component-driven views    |
| Vite             | Development server and build tooling     |
| Tailwind CSS     | Utility-first styling and theming        |
| socket.io-client | Real-time client for admin notifications |
| Axios            | HTTP client and centralized API layer    |
| Framer Motion    | UI micro-animations                      |
| lucide-react     | Icon set                                 |

### High-Level Architecture

```
Browser (Visitor / Admin)
      │
      ▼
  Frontend (Vite + React + Tailwind)
      │
      ├─ Public Portfolio UI (static + dynamic)
      └─ Admin Panel UI (protected)
      │
      ▼
  Backend API (https://portfolio-backend-lgvk.onrender.com)
      ├─ REST endpoints (auth, messages, content, backups)
      └─ Socket.io namespace for admin realtime events
```

---

## 2. Folder Structure (visual)

```
frontend/
├── .env                 # optional local env vars (VITE_ prefixed for client)
├── package.json
├── postcss.config.js
├── vite.config.js
├── public/              # static assets
├── index.html
├── src/
│   ├── main.jsx         # app bootstrap, providers
│   ├── App.jsx          # route mount and top-level layout
│   ├── index.css        # Tailwind entry
│   ├── assets/          # images, fonts, icons
│   ├── shared/          # cross-cutting utilities
│   │   ├── components/  # UI primitives (Buttons, Inputs, Modals)
│   │   ├── context/     # AuthContext, SocketContext
│   │   ├── services/    # api.js, authService, backupService
│   │   ├── hooks/       # useAuth, useSocket, useFetch
│   │   └── utils/       # formatters, validators
│   ├── admin-manager/   # Admin application (protected)
│   │   ├── authentication/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── backup-management/
│   │   └── notifications/
│   ├── public-portfolio/ # Public pages & sections
+│   │   ├── pages/
│   │   └── layout/
│   ├── routes/          # route definitions and guards
│   └── styles/          # design tokens & component css
└── README.md
```

Notes:

- Client env vars must be `VITE_` prefixed: `VITE_BACKEND_URL`, `VITE_GOOGLE_CLIENT_ID`, feature toggles.

---

## 3. Module & File Annotations

| Path / File Name                                 | Core Responsibility                                                         | Technologies & Libraries Used         |
| :----------------------------------------------- | :-------------------------------------------------------------------------- | :------------------------------------ |
| `package.json`                                   | Declares dependencies and scripts (`dev`, `build`, `preview`).              | npm, Vite                             |
| `vite.config.js`                                 | Configures dev server, proxy to backend for local development.              | Vite                                  |
| `.env`                                           | Local environment variables for dev.                                        | -                                     |
| `src/main.jsx`                                   | Initializes React root, wraps `AuthContext` and `SocketContext`.            | React                                 |
| `src/App.jsx`                                    | Router mount, public vs admin route orchestration, error boundaries.        | React Router                          |
| `src/index.css`                                  | Tailwind base, custom utilities and theme tokens.                           | Tailwind CSS, PostCSS                 |
| `src/shared/components`                          | Design primitives and shared UI building blocks.                            | Tailwind, Lucide Icons, Framer Motion |
| `src/shared/context/AuthContext.jsx`             | Holds auth state, login/logout, token refresh logic.                        | React Context, Axios interceptors     |
| `src/shared/context/SocketContext.jsx`           | Manages socket lifecycle and exposes API to subscribe to events.            | socket.io-client                      |
| `src/shared/services/api.js`                     | Axios instance: baseURL, credentials, interceptors for auth/refresh.        | Axios                                 |
| `src/shared/services/authService.js`             | `POST /api/auth/google`, logout, token refresh helpers.                     | Axios                                 |
| `src/shared/services/backupService.js`           | Backup CRUD API calls used by admin backup UI.                              | Axios, File API                       |
| `src/shared/hooks/useSocket.js`                  | Hook for subscribing to socket events and auto-cleanup.                     | React hooks, socket.io-client         |
| `src/routes/ProtectedRoute.jsx`                  | Guard for admin routes that enforces auth and roles.                        | React Router                          |
| `src/admin-manager/layout/Sidebar.jsx`           | Navigation, unread badge integration (pulls unread count from inbox state). | Tailwind, Lucide Icons                |
| `src/admin-manager/dashboard/Dashboard.jsx`      | Aggregates widgets; initializes analytics fetches and socket listeners.     | React, charting (if used)             |
| `src/admin-manager/backup-management/Backup.jsx` | UI for create/download/restore backups and scheduling.                      | Axios, Tailwind                       |
| `src/public-portfolio/pages/Homepage.jsx`        | Public homepage, hero, featured projects listing.                           | React, Tailwind                       |
| `src/public-portfolio/pages/Contact.jsx`         | Contact form and client-side validation; posts to `/api/messages`.          | Axios, form validation                |
| `public/`                                        | Static assets served by Vite.                                               | -                                     |

---

## 4. Data Pipeline & Real-Time Events

This section documents runtime flows for Public and Admin branches.

### Public Branch (visitor-facing)

- Flow:
  1. Visitor loads public pages; static assets served by the frontend bundle.
  2. Dynamic content loaded via API calls to `VITE_BACKEND_URL` (projects, skills, about).
  3. Contact form `POST /api/messages` sends visitor payload to backend.
  4. Backend persists the message; if configured, emits a Socket.io event to admin clients.

- Analytics and masking:
  - Admin JWTs are excluded from public analytics on the server-side to keep visitor metrics accurate.
  - Contact submissions are validated client-side and server-side and subject to backend rate limits.

### Admin Panel Branch (admin-facing)

- Auth flow (brief):
  1. Admin obtains Google ID token via Google Identity Services.
  2. Client posts the ID token to `/api/auth/google` for server-side verification.
  3. On success, backend returns app access token and sets refresh token cookie.

- Real-time message handling (Socket.io):
  - Server emits `message:created` on new contact submissions.
  - `SocketContext` listens and updates inbox state; triggers unread badge increment and toast.
  - On reconnect, client queries `GET /api/admin/messages?since=<lastSync>` to reconcile missed messages.

---

## 5. Request Lifecycle (frontend perspective)

1. User action (click, submit form) triggers UI handler.
2. Handler calls a service in `src/shared/services/*` which uses the Axios `api` instance.
3. `api` instance attaches `Authorization: Bearer <token>` when logged in and handles 401 refresh flows.
4. The response is returned; UI updates state or navigates.
5. For real-time flows, socket events update client state directly (optimistic UI may also re-fetch resources).

Example: Contact form submit

```
submitContact(payload)
  → authService.api.post('/api/messages', payload)
  → 201 created
  → show success toast
  → backend emits socket `message:created`
  → admin clients receive socket event and update inbox
```

---

## 6. File Uploads & Media Flow

- Upload pattern:
  1. Admin selects file in UI; frontend sends multipart/form-data to `/api/media/upload`.
  2. Backend returns canonical URL (Cloudinary or local fallback).
  3. Frontend uses returned URL when creating/updating projects or content.

Limits and rules (frontend notes):

- Enforce client-side file size checks before upload for better UX.
- Validate file types (images, pdf) where applicable.

---

## 7. Offline / Reconnect Strategy

- Socket reconnection: `SocketContext` exposes `onReconnect` hook which triggers a state re-sync for critical collections (inbox, notifications).
- For missed API-driven updates while offline, the client issues a delta sync endpoint with a `since` timestamp.

---

## 8. Developer Guide

### Add a new public page

1. Create folder under `src/public-portfolio/pages/`.
2. Add route in `src/App.jsx` (public routes section).
3. If new data required, add a service wrapper in `src/shared/services/` and call backend endpoint.

### Add a new admin feature

1. Create folder under `src/admin-manager/` with components and pages.
2. Add route under protected admin routes and use `ProtectedRoute`.
3. Consume `authService` and `api` for secure calls.

### Environment & Run

```bash
cd frontend
npm install
npm run dev        # development
npm run build      # production bundle
npm run preview    # preview production build
```

---

## 9. Security & Best Practices

- Never store secrets in the frontend; use `VITE_` env vars for non-sensitive runtime values only.
- Keep refresh tokens httpOnly and store access tokens in memory/context.
- Remove temporary debug logs before merging production changes.

---

## 10. Appendix: Key Env Vars

| Var                     | Purpose                            |
| ----------------------- | ---------------------------------- |
| `VITE_BACKEND_URL`      | Backend API base URL               |
| `VITE_GOOGLE_CLIENT_ID` | Google Identity Services client id |

---

Document history

- Created: 2026-06-12
- Author: Frontend team (aligned with backend doc style)

---

**WORKSPACE SYSTEM OVERVIEW**

This frontend repository is a Vite-powered React application styled with Tailwind CSS. It serves two primary experiences:

- The Public Portfolio: a static / dynamic site for visitors and potential employers.
- The Admin Panel: a protected dashboard used by site administrators to manage content, view analytics, and receive real-time inbox messages.

Core technologies and patterns used in this workspace:

- React (hooks, component-driven views) — supports JSX/TSX as applicable.
- Vite — fast development server and optimized production builds.
- Tailwind CSS — utility-first styling with a dark-mode token strategy.
- Socket.io (client) — real-time notifications and live inbox updates for admins.
- Axios / fetch wrappers — centralized API client with interceptors for token refresh and global error handling.
- React Context / custom hooks — `AuthContext`, `SocketContext`, and `useSocket` for shared state and lifecycle.

Backend integration

The frontend connects to the backend API at: https://portfolio-backend-lgvk.onrender.com

Authentication flow (summary)

1. Admin uses Google Identity Services to obtain an ID token in-browser.
2. The client sends the ID token to the backend `POST /api/auth/google` for server-side verification.
3. Backend verifies the token, matches the email against `ADMIN_EMAIL`, and issues application JWT access and refresh tokens.

Security notes

- Admin routes are gated by JWTs / short-lived access tokens issued by the backend.
- Sensitive operations (backups, imports, admin actions) call server endpoints protected by role checks and use secure cookie practices for refresh tokens.

---

**VISUAL DIRECTORY TREE MAP**

```
frontend/
├── .env                 # optional local env vars (VITE_ prefixed for client)
├── package.json
├── postcss.config.js
├── vite.config.js
├── public/              # static public assets
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css        # Tailwind entry
│   ├── assets/          # static images, icons, fonts
│   ├── shared/
│   │   ├── components/  # reusable UI primitives
│   │   ├── context/     # React Contexts (Auth, Socket)
│   │   ├── services/    # API clients, backupService, authService
│   │   ├── hooks/       # custom hooks (useAuth, useSocket, useFetch)
│   │   └── utils/       # helpers, formatters
│   ├── admin-manager/   # Admin Panel app area
│   │   ├── layout/      # Admin layout, sidebars, navbars
│   │   ├── dashboard/   # admin dashboard pages and widgets
│   │   ├── activity-management/
│   │   ├── analytics-management/
│   │   ├── backup-management/
│   │   ├── media-management/
│   │   └── user-management/
│   ├── public-portfolio/ # Public pages and reusable sections
│   │   ├── pages/       # Home, About, Projects, Contact
│   │   └── layout/
│   ├── routes/          # route definitions and guarded routes
│   └── styles/          # component-specific style tokens
└── README.md
```

Notes on `.env` and config parameters:

- Client-side environment variables must be prefixed with `VITE_` (e.g. `VITE_BACKEND_URL`).
- Suggested runtime values: `VITE_BACKEND_URL`, `VITE_GOOGLE_CLIENT_ID`, feature toggles like `VITE_FEATURE_BACKUPS`.

---

**DETAILED FILE & FOLDER ANNOTATION TABLE**

| Path / File Name                                 | Core Responsibility                                                                                  | Technologies & Libraries Used                     |
| :----------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :------------------------------------------------ |
| `package.json`                                   | Declares frontend dependencies, scripts, and build commands.                                         | npm, Vite scripts                                 |
| `vite.config.js`                                 | Vite dev server and build-time config (proxy for API in dev).                                        | Vite                                              |
| `.env` / `.env.local`                            | Local client environment values (VITE\_ prefixed).                                                   | -                                                 |
| `index.html`                                     | App entry HTML for Vite; mounts React root.                                                          | HTML5                                             |
| `src/main.jsx`                                   | App bootstrap: renders `App`, wraps Context providers (Auth, Socket).                                | React, ReactDOM                                   |
| `src/App.jsx`                                    | Top-level route orchestration and global error boundaries.                                           | React Router                                      |
| `src/index.css`                                  | Tailwind base, components and utilities.                                                             | Tailwind CSS, PostCSS                             |
| `src/shared/components`                          | Design-system primitives and small reusable UI components (Buttons, Inputs, Icons, Modals, Toaster). | Tailwind, Lucide Icons, Framer Motion             |
| `src/shared/context/AuthContext.jsx`             | Auth provider: stores tokens, user profile, and convenience helpers (`login()`, `logout()`).         | React Context, localStorage, Axios interceptors   |
| `src/shared/context/SocketContext.jsx`           | Socket.io client wrapper, exposes event listeners and emitters.                                      | socket.io-client                                  |
| `src/shared/services/authService.js`             | API client for auth endpoints: `POST /api/auth/google`, refresh tokens, logout.                      | Axios                                             |
| `src/shared/services/backupService.js`           | Backup-related API calls, listing, upload, download, restore.                                        | Axios, File API                                   |
| `src/shared/hooks/useSocket.js`                  | Encapsulates socket event registration and cleanup.                                                  | socket.io-client, React hooks                     |
| `src/routes/ProtectedRoute.jsx`                  | Route guard: redirects to login when no valid auth token present.                                    | React Router                                      |
| `src/admin-manager/layout/Sidebar.jsx`           | Admin navigation and unread badge integration.                                                       | Tailwind, Lucide Icons                            |
| `src/admin-manager/dashboard/Dashboard.jsx`      | Admin dashboard entry: aggregates widgets, analytics and live notifications.                         | React, Charting libs (optional), socket listeners |
| `src/admin-manager/backup-management/Backup.jsx` | Backup UI for create/download/restore and scheduling.                                                | Axios, Tailwind                                   |
| `src/public-portfolio/pages/Homepage.jsx`        | Public homepage — hero, skills, projects, contact CTA.                                               | React, Tailwind                                   |
| `src/public-portfolio/pages/Contact.jsx`         | Public contact form that POSTs to backend and shows UX states.                                       | Axios, form libraries (optional)                  |
| `src/shared/utils/formatters.js`                 | Date, currency, string helpers used across UI.                                                       | plain JS                                          |
| `public/`                                        | Static assets served at root.                                                                        | -                                                 |

---

**DATA PIPELINE & REAL-TIME EVENT DOCUMENTATION**

This section describes the runtime data and event flows for the two operational branches: Public Branch and Admin Panel Branch.

Public Branch (visitor-facing)

- Flow summary:
  1. Visitor loads public pages (Home, Projects, About) served by the Vite-built static assets.
  2. For dynamic content (projects, blog entries), the frontend calls the backend API at `VITE_BACKEND_URL` to fetch JSON payloads.
  3. When a visitor submits the Contact form, the client POSTs a message payload to `/api/messages`.
  4. Backend persists the message to MongoDB and returns a 201 response. Optionally, the backend emits a Socket.io event (server-side) that Admin Panel clients can listen to (if admin is connected).

- Security & analytics handling:
  - The public branch masks administrative sessions by only attaching auth cookies/headers when a verified admin is logged in.
  - Analytics endpoints intentionally ignore requests that include admin JWTs (server side) to avoid polluting visitor metrics.
  - Contact forms should validate inputs client-side and server-side and apply rate-limiting on the backend.

Admin Panel Branch (admin-facing)

- Flow summary:
  1. Admin visits `/admin` and signs in via Google Identity Services client.
  2. Browser gets a Google ID token and POSTs it to `/api/auth/google`.
  3. Backend verifies the token server-side, validates the email against allowed `ADMIN_EMAIL`, and issues application JWT access and refresh tokens.
  4. Frontend stores access token in memory/context and refresh token in an httpOnly cookie (recommended). Axios interceptors attach `Authorization: Bearer <token>` to API requests.
  5. On successful login, the frontend initializes a Socket.io client using the same backend origin and passes the access token for server-side socket authorization.

- Real-time message handling (Socket.io):
  - Server-side: when a new contact message is created, the backend emits a `message:created` event on a secured channel (namespaced or room-based) with the new message metadata.
  - Client-side (`SocketContext`): listens for `message:created` and updates local inbox state (pushes the new message into `inbox` state) and increments the navbar unread badge counter.
  - UI behavior: receiving a `message:created` triggers two UI updates:
    - Navbar unread count (badge) increments.
    - Toast notification appears with a short message summary and an action button `View Inbox`.

- State management & synchronization:
  - Primary in-memory state lives in `AuthContext` and `Inbox` local state inside admin pages; persistent state (message list) is re-fetched from API as the source of truth.
  - On socket reconnect the client re-syncs by calling `GET /api/admin/messages?since=<lastSync>` to fetch any messages missed while offline.

---

**DOCUMENTATION STYLE RULES & CONTRIBUTING NOTES**

- Keep files and components small and focused: prefer single-responsibility for components.
- Use `src/shared/components` for any UI component that will be reused across both Public and Admin experiences.
- Prefer hooks for side effects and socket management (`useSocket`, `useAutoRefreshTokens`).
- Document new sections in this file when adding major features (e.g., new real-time events, backup automation, or analytics endpoints).
- Remove or redact sensitive console diagnostics before merging to `main` for production builds.

---

Document history

- Created: 2026-06-12
- Author: Team review helper
