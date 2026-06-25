# Portifolio

A full-stack MERN portfolio for Desalegn — React frontend with Tailwind CSS + Express/MongoDB backend with a 2FA-protected enterprise-grade admin dashboard featuring real public portfolio visitor analytics. Includes both a 2D and immersive 3D scrollable portfolio experience.

## Architecture

```
modernize-portifo/
├── frontend/              React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/       UI components (Navbar, Footer, sections)
│   │   ├── hooks/            Custom hooks (dark mode, scroll, tracking)
│   │   ├── pages/            Route pages (Home, Login)
│   │   ├── context/          Auth state management
│   │   ├── services/         Axios API client with JWT interceptor
│   │   ├── admin/            Admin dashboard (8 pages, 15+ components)
│   │   │   ├── components/   Sidebar, Navbar, DataTable, StatCard, ...
│   │   │   ├── pages/        Dashboard, Analytics, Projects, CMS, ...
│   │   │   ├── context/      Admin sidebar/theme state
│   │   │   ├── layout/       AdminLayout with AnimatePresence routing
│   │   │   └── routes/       Admin route definitions
│   │   └── public-portfolio/ Public portfolio pages & 3D engine
│   │       ├── pages/        HomePage, DynamicCustomPage, NotFound
│   │       ├── sections/     Hero, About, Skills, Projects, Contact, Footer
│   │       ├── layout/       PublicLayout with Navbar
│   │       └── 3d/           3D scrollable portfolio engine
│   │           ├── config/       Section definitions & mode config
│   │           ├── hooks/        useScrollManager, useHeroData, useAboutData, ...
│   │           ├── components/   SceneRouter, SceneEnvironment, ScrollIndicator
│   │           └── scenes/       Hero/, About/, Skills/, Projects/, Contact, Footer
│   └── dist/                 Production build
├── backend/               Express + Mongoose + MongoDB Atlas
│   ├── src/
│   │   ├── shared/models/    Mongoose schemas (Admin, Visit, Project, CustomPage, ...)
│   │   ├── admin/            Admin API routes & controllers
│   │   │   ├── custom-pages/     Custom pages CRUD
│   │   │   ├── home-content/     Home/Hero content
│   │   │   ├── about-content/    About section content
│   │   │   └── ...               Other admin modules
│   │   ├── public/           Public API routes
│   │   │   └── custom-pages/     Public slug lookup
│   │   ├── middleware/       JWT authentication
│   │   ├── config/           DB connection, env-based config
│   │   └── utils/            IP geolocation, user-agent parsing
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js >= 18
- MongoDB Atlas cluster (or local MongoDB)
- Git

## Setup

### 1. Clone & install

```bash
git clone https://github.com/your-repo/modernize-portifo.git
cd modernize-portifo

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Environment variables

**Backend** — `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/portfolio
JWT_SECRET=a_random_64_char_string
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

**Frontend** — `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 3. Run locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

## Admin & 2FA Setup

Requires one-time setup after deploying:

```bash
# 1. Register admin
curl -X POST http://localhost:5000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourStrongPassword123"}'

# 2. Open in browser to scan QR code into Google Authenticator
# http://localhost:5000/api/auth/setup-2fa?email=admin@example.com

# 3. Navigate to http://localhost:5173/login
#    Enter email + password → 6-digit code → analytics dashboard
```

## API Endpoints

### Auth & Analytics

| Method | Path                                 | Auth | Description                                                                        |
| ------ | ------------------------------------ | ---- | ---------------------------------------------------------------------------------- |
| GET    | `/api/health`                        | No   | Server health check                                                                |
| POST   | `/api/analytics/log-visit`           | No   | Log a portfolio visit (enriched with page, referrer, visitorId)                    |
| GET    | `/api/analytics/metrics`             | JWT  | Paginated visit log with search, date/country/device/browser/source filters        |
| GET    | `/api/analytics/stats`               | JWT  | Dashboard aggregate stats (total, unique, today, week, month, recent)              |
| GET    | `/api/analytics/analytics-dashboard` | JWT  | Full analytics dashboard data (trends, device/browser/country/source distribution) |
| POST   | `/api/auth/register-admin`           | No   | One-time admin registration                                                        |
| GET    | `/api/auth/setup-2fa`                | No   | Generate TOTP secret + QR code                                                     |
| POST   | `/api/auth/admin-login`              | No   | Two-phase login (password → 2FA → JWT)                                             |

### Custom Pages (Admin)

| Method | Path                                      | Auth | Description                          |
| ------ | ----------------------------------------- | ---- | ------------------------------------ |
| GET    | `/api/admin/custom-pages`                 | JWT  | List all custom pages                |
| POST   | `/api/admin/custom-pages`                 | JWT  | Create a new custom page             |
| GET    | `/api/admin/custom-pages/:id`             | JWT  | Get custom page by ID                |
| PUT    | `/api/admin/custom-pages/:id`             | JWT  | Update custom page                   |
| DELETE | `/api/admin/custom-pages/:id`             | JWT  | Delete custom page                   |
| PATCH  | `/api/admin/custom-pages/:id/toggle-status` | JWT | Toggle page active/inactive status |

### Custom Pages (Public)

| Method | Path                        | Auth | Description                              |
| ------ | --------------------------- | ---- | ---------------------------------------- |
| GET    | `/api/public/custom-pages/slug/:slug` | No | Get published custom page by slug    |

## Frontend Routes

### Public Portfolio

| Path                   | Component          | Description                                        |
| ---------------------- | ------------------ | -------------------------------------------------- |
| `/`                    | Home               | Portfolio landing page with all 2D sections        |
| `/3d`                  | ThreeDPortfolio    | Immersive 3D scrollable portfolio                  |
| `/:customSlug`         | DynamicCustomPage  | Admin-managed custom pages rendered by slug        |
| `*`                    | NotFound           | 404 page                                           |

### Admin Dashboard

| Path                   | Component     | Description                                                   |
| ---------------------- | ------------- | ------------------------------------------------------------- |
| `/admin/dashboard`     | Dashboard     | Overview with stat cards, recent activity, traffic bars       |
| `/admin/analytics`     | Analytics     | Full visitor analytics with 6 charts, filters, enriched table |
| `/admin/projects`      | Projects      | Portfolio project CRUD                                        |
| `/admin/skills`        | Skills        | Technology skill management                                   |
| `/admin/certificates`  | Certificates  | Certificate CRUD                                              |
| `/admin/home`          | Home CMS      | Hero section content editor                                   |
| `/admin/about`         | About CMS     | Biography, experience, education editor                       |
| `/admin/contact`       | Contact CMS   | Contact info & social links editor                            |
| `/admin/media`         | Media Library | File/image upload management                                  |
| `/admin/footer`        | Footer CMS    | Footer content editor                                         |
| `/admin/custom-pages`  | Custom Pages  | Create/edit/delete custom pages with section builder          |
| `/admin/notifications` | Notifications | System notification list                                      |
| `/admin/activity-logs` | Activity Logs | Admin action audit trail                                      |
| `/admin/settings`      | Settings      | Portfolio configuration                                       |
| `/admin/backup`        | Backup        | Database backup & restore                                     |
| `/admin/import-export` | Import/Export | Data import/export tools                                      |
| `/admin/maintenance`   | Maintenance   | DB health, indexes, orphan files                              |
| `/admin/system-config` | System Config | System-wide settings                                          |
| `/admin/profile`       | Profile       | Admin account profile                                         |
| `/admin/theme`         | Appearance    | Light/dark/system theme configuration                         |

## Features

### 2D Portfolio

- **Sections**: Hero, About, Skills, Projects, Contact (smooth-scroll navigation)
- **Dark mode**: Persistent theme toggle with system preference support
- **Responsive**: Mobile-first with animated navbar drawer
- **Framer Motion**: Entrance animations, scroll-triggered reveals
- **i18n**: English and Amharic language support

### 3D Portfolio (`/#/3d`)

An immersive scrollable 3D experience built with Three.js / React Three Fiber:

- **Scroll-driven navigation**: HTML scroll maps to 3D scene transitions via `useScrollManager`
- **Hero Scene**: Floating 3D photo frame with glowing neon borders, orbiting rings, parallax particles, cinematic lighting, and admin-managed data (name, badge, stats, social links)
- **About Scene**: Story pillar cards, IDE-style code block with developer config, highlight metrics, certifications — all from admin content
- **Skills Scene**: (placeholder, in progress)
- **Projects Scene**: (placeholder, in progress)
- **Contact Scene**: (placeholder, in progress)
- **Footer Scene**: (placeholder, in progress)
- **SceneEnvironment**: Dynamic starfield, fog, ambient lighting
- **ScrollIndicator**: Fixed dot navigation sidebar
- **Responsive**: Adapts particle count, text scale, camera position, and model scale by viewport
- **Performance**: `useMemo` for colors, `useRef` for mouse tracking (zero rerenders), `instancedMesh` for particles, lazy-loaded scenes

#### 3D Architecture

```
3d/
├── config/portfolioMode.js         Section definitions (hero 0-18%, about 18-36%, ...)
├── hooks/
│   ├── useScrollManager.js         Maps scroll position → section index + local progress
│   ├── useHeroData.js              Fetches same data as 2D Hero (greeting, name, stats, ...)
│   ├── useAboutData.js             Fetches same data as 2D About (pillars, metrics, skills, ...)
│   ├── useMousePosition.js         Normalized mouse position for parallax (useRef, no rerender)
│   └── useResponsive.js            Viewport breakpoints → particle count, text scale, camera Z
├── components/
│   ├── SceneRouter.jsx             Lazy-loads correct scene by section index
│   ├── SceneEnvironment.jsx        Stars, fog, ambient lights
│   └── ScrollIndicator.jsx         Fixed dot nav with section labels
└── scenes/
    ├── HeroScene.jsx               Main Hero controller composing sub-components
    ├── Hero/
    │   ├── HeroModel.jsx           3D photo frame with neon borders + profile texture
    │   ├── HeroText.jsx            Greeting, name, badge, intro (2-3 line wrap), stats, socials
    │   ├── HeroLights.jsx          4-light cinematic rig with scroll fade
    │   ├── HeroParticles.jsx       300 instanced spheres with scroll parallax
    │   ├── HeroEffects.jsx         Wireframe background shapes with mouse parallax
    │   └── HeroAnimation.jsx       Camera controller + mouse tracking
    ├── AboutScene.jsx              Story pillars, code block, metrics, certifications
    ├── SkillsScene.jsx             (placeholder)
    ├── ProjectsScene.jsx           (placeholder)
    ├── ContactScene.jsx            (placeholder)
    └── FooterScene.jsx             (placeholder)
```

### Custom Pages System

Admin-managed dynamic pages with a section-based builder:

- **Backend**: `CustomPage` model with slug, status (draft/published/inactive), `sections` array
- **Section types**: Text, Image, Gallery, Video, Button, HTML embed
- **Admin UI**: List view with search/filter/pagination, form with drag-and-drop section builder
- **Public rendering**: Slug-based routing (`/:customSlug`), responsive section layout
- **SEO**: Meta title/description support per page

#### Section Builder

Each custom page contains an ordered array of sections, each with:
- **Type**: text, image, gallery, video, button, or html
- **Content**: Type-specific fields (title, body, URL, alt text, button text/link)
- **Layout**: Full-width or contained
- **Visibility**: Toggle individual sections on/off

### Visit Tracking

- **Automatic**: IP geolocation (country/city/region via ipapi.co)
- **Device detection**: Desktop, mobile, tablet via ua-parser-js
- **Browser/OS**: Chrome, Firefox, Safari, Edge, etc.
- **Referrer parsing**: Google, LinkedIn, GitHub, Direct, etc.
- **Returning visitors**: Anonymous visitorId persisted in localStorage
- **Admin exclusion**: `/admin` routes, `/login`, and local IPs are never tracked

### Admin Dashboard (2FA-protected)

- **Sidebar**: 5 navigation groups with accordion, Cmd+K search, collapse mode, mobile drawer
- **Navbar**: Dynamic breadcrumbs, global search modal, account dropdown, notification bell
- **Dashboard**: Welcome hero, 5 animated stat cards, traffic bar chart, recent activity feed, quick actions
- **Analytics** (`/admin/analytics`):
  - Stat cards: total views, unique visitors, today, week, month
  - 6 charts: 7-day trend, 30-day trend, browser distribution, device distribution, top countries, traffic sources
  - Interactive filters: date range, country, device, browser, source
  - Enriched table: date/time, visitor type (new/returning), country, city, device, browser, OS, referrer
- **DataTable**: Sticky header, column filters, checkboxes, pagination, search, row animations
- **ConfirmModal**: Glassmorphism background, ESC/click-outside close, spring animations
- **NotificationBell**: Tabbed (all/unread), categorized icons, mark read/delete actions
- **Theme**: Light, dark, system modes with smooth CSS transitions

## Deployment

### Backend (Render)

1. Push to GitHub
2. In Render dashboard → **New Web Service** → connect repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add environment variables (`MONGO_URI`, `JWT_SECRET`, etc.)
5. Deploy

### Frontend (Vercel)

1. Push to GitHub
2. In Vercel dashboard → **Add New Project** → connect repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. Add environment variable `VITE_API_URL` pointing to your Render backend URL
5. Deploy

## Security

- Passwords hashed with bcryptjs (12 salt rounds)
- TOTP-based two-factor authentication via speakeasy + Google Authenticator
- JWT tokens for session management (configurable expiry, httpOnly cookies)
- All admin API endpoints protected by JWT middleware with super_admin role check
- Account lockout after repeated failed login attempts
- Admin password and 2FA secret are never exposed in API responses
- Admin routes (`/admin/*`) excluded from visitor analytics tracking

## Scripts

### Backend

- `npm run dev` — Start with nodemon (auto-restart)
- `npm start` — Start for production

### Frontend

- `npm run dev` — Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
