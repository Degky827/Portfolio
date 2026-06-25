# Portifolio

A full-stack MERN portfolio for Desalegn — React frontend with Tailwind CSS + Express/MongoDB backend with a 2FA-protected enterprise-grade admin dashboard featuring real-time visitor analytics, AI chatbot, 3D scrollable portfolio, and comprehensive security management.

## Architecture

```
modernize-portifo/
├── frontend/                    React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── admin-manager/       Admin dashboard (26 modules)
│   │   │   ├── about-management/
│   │   │   ├── activity-management/
│   │   │   ├── analytics-management/
│   │   │   ├── authentication/    Login, AuthContext, RoleGuard, ProtectedRoute
│   │   │   ├── backup-management/
│   │   │   ├── contact-management/
│   │   │   ├── context/           AdminContext, ThemeContext
│   │   │   ├── custom-pages-management/
│   │   │   ├── dashboard/
│   │   │   ├── footer-management/
│   │   │   ├── homepage-management/
│   │   │   ├── import-export/
│   │   │   ├── layout/            AdminLayout, Sidebar, Navbar, ThemeToggle
│   │   │   ├── maintenance/
│   │   │   ├── media-management/
│   │   │   ├── navigation-management/
│   │   │   ├── notifications/
│   │   │   ├── profile-management/
│   │   │   ├── projects-management/
│   │   │   ├── routes/            AdminRoutes.jsx
│   │   │   ├── security-management/
│   │   │   ├── settings-management/
│   │   │   ├── shared/            PageHeader, Toast, DataTable, ConfirmModal, ...
│   │   │   ├── skills-management/
│   │   │   ├── system-config/
│   │   │   └── user-management/
│   │   ├── ai/                    AI chatbot (ChatWindow, AIButton, useChat)
│   │   ├── locales/               i18n translations (en.json, am.json)
│   │   ├── public-portfolio/      Public portfolio pages & 3D engine
│   │   │   ├── 3d/                3D scrollable portfolio engine
│   │   │   ├── layout/            Navbar, Footer
│   │   │   ├── pages/             HomePage, DynamicCustomPage
│   │   │   └── shared/            Shared hooks, data, context
│   │   ├── shared/                Shared code across app
│   │   │   ├── components/        ErrorBoundary, Logo
│   │   │   ├── context/           SiteSettingsContext, SocketContext
│   │   │   ├── hooks/             7 custom hooks (useUnreadMessages, etc.)
│   │   │   ├── services/          22 API service files
│   │   │   └── utils/             Utility functions
│   │   ├── test/                  Test setup
│   │   ├── App.jsx
│   │   ├── i18n.js
│   │   └── main.jsx
│   └── dist/                      Production build
├── backend/                     Express + Mongoose + MongoDB Atlas
│   ├── src/
│   │   ├── admin/                 Admin API (12 modules)
│   │   │   ├── activity-logs/     Activity log CRUD + export
│   │   │   ├── analytics/         Visit tracking + dashboard data
│   │   │   ├── auth/              JWT auth, 2FA (TOTP), Google OAuth
│   │   │   ├── backups/           Backup CRUD + restore
│   │   │   ├── custom-pages/      Custom pages CRUD
│   │   │   ├── import-export/     Data import/export
│   │   │   ├── maintenance/       DB health, storage, indexes
│   │   │   ├── media/             Cloudinary media upload
│   │   │   ├── notifications/     System notifications
│   │   │   ├── security/          Security settings, sessions, audit
│   │   │   ├── system/            System-wide config
│   │   │   └── users/             User CRUD (super_admin)
│   │   ├── ai/                    AI chatbot (Google Generative AI)
│   │   │   ├── controllers/
│   │   │   ├── prompts/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── validations/
│   │   ├── infrastructure/        Core infrastructure
│   │   │   ├── config/            Environment-based config
│   │   │   ├── database/          MongoDB connection
│   │   │   ├── socket/            Socket.IO setup
│   │   │   └── storage/           Cloudinary + S3 upload
│   │   ├── public/                Public API (10 modules)
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── custom-pages/
│   │   │   ├── footer/
│   │   │   ├── homepage/
│   │   │   ├── navigation/
│   │   │   ├── projects/
│   │   │   ├── settings/
│   │   │   ├── site-settings/
│   │   │   └── skills/
│   │   ├── shared/                Shared backend code
│   │   │   ├── middleware/        auth, csrf, rateLimiter, sanitize, validate
│   │   │   ├── models/           23 Mongoose schemas
│   │   │   ├── services/         backupScheduler, healthMonitor, s3Uploader, ...
│   │   │   └── utilities/        9 utility modules
│   │   └── server.js
│   └── package.json
├── docs/
├── docker-compose.yml
├── Dockerfile
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
GOOGLE_CLIENT_ID=your_google_client_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_AI_API_KEY=your_google_ai_key
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

### Health Check

| Method | Path          | Auth | Description         |
| ------ | ------------- | ---- | ------------------- |
| GET    | `/api/health` | No   | Server health check |

### Auth

| Method | Path                         | Auth                      | Description                     |
| ------ | ---------------------------- | ------------------------- | ------------------------------- |
| POST   | `/api/auth/login`            | No (rate-limited: 10/15m) | Step 1: password verification   |
| POST   | `/api/auth/verify-2fa`       | No (rate-limited: 20/15m) | Step 2: TOTP verification → JWT |
| POST   | `/api/auth/google`           | No (rate-limited: 5/15m)  | Google OAuth login              |
| POST   | `/api/auth/logout`           | JWT                       | Logout, clear cookie            |
| POST   | `/api/auth/refresh`          | No                        | Refresh access + refresh tokens |
| GET    | `/api/auth/me`               | JWT                       | Get current user profile        |
| PATCH  | `/api/auth/me`               | JWT                       | Update current user profile     |
| POST   | `/api/auth/setup-2fa`        | JWT                       | Generate TOTP secret + QR code  |
| POST   | `/api/auth/verify-2fa-setup` | JWT                       | Verify TOTP and enable 2FA      |
| POST   | `/api/auth/disable-2fa`      | JWT                       | Disable 2FA                     |

### Users (super_admin only)

| Method | Path             | Auth              | Description    |
| ------ | ---------------- | ----------------- | -------------- |
| GET    | `/api/users`     | JWT + super_admin | List all users |
| GET    | `/api/users/:id` | JWT + super_admin | Get user by ID |
| POST   | `/api/users`     | JWT + super_admin | Create user    |
| PUT    | `/api/users/:id` | JWT + super_admin | Update user    |
| DELETE | `/api/users/:id` | JWT + super_admin | Delete user    |

### Analytics

| Method | Path                                 | Auth                    | Description                      |
| ------ | ------------------------------------ | ----------------------- | -------------------------------- |
| POST   | `/api/analytics/log-visit`           | No (rate-limited: 60/m) | Log a portfolio visit            |
| POST   | `/api/analytics/log-engagement`      | No (rate-limited: 60/m) | Log user engagement event        |
| GET    | `/api/analytics/metrics`             | JWT                     | Paginated visit log with filters |
| GET    | `/api/analytics/stats`               | JWT                     | Dashboard aggregate stats        |
| GET    | `/api/analytics/analytics-dashboard` | JWT                     | Full analytics dashboard data    |
| DELETE | `/api/analytics/clear`               | JWT                     | Clear all analytics data         |

### Projects

| Method | Path                          | Auth              | Description         |
| ------ | ----------------------------- | ----------------- | ------------------- |
| GET    | `/api/projects`               | No                | List all projects   |
| GET    | `/api/projects/slug/:slug`    | No                | Get project by slug |
| GET    | `/api/projects/:id`           | No                | Get project by ID   |
| POST   | `/api/projects`               | JWT + super_admin | Create project      |
| PUT    | `/api/projects/reorder`       | JWT + super_admin | Reorder projects    |
| PUT    | `/api/projects/:id`           | JWT + super_admin | Update project      |
| DELETE | `/api/projects/:id`           | JWT + super_admin | Delete project      |
| POST   | `/api/projects/:id/duplicate` | JWT + super_admin | Duplicate project   |
| PATCH  | `/api/projects/:id/featured`  | JWT + super_admin | Toggle featured     |
| PATCH  | `/api/projects/:id/publish`   | JWT + super_admin | Toggle publish      |
| PATCH  | `/api/projects/:id/archive`   | JWT + super_admin | Toggle archive      |
| PATCH  | `/api/projects/:id/images`    | JWT + super_admin | Update images       |

### Skills

| Method | Path              | Auth | Description     |
| ------ | ----------------- | ---- | --------------- |
| GET    | `/api/skills`     | No   | List all skills |
| GET    | `/api/skills/:id` | No   | Get skill by ID |
| POST   | `/api/skills`     | JWT  | Create skill    |
| PUT    | `/api/skills/:id` | JWT  | Update skill    |
| DELETE | `/api/skills/:id` | JWT  | Delete skill    |

### Categories

| Method | Path                      | Auth | Description         |
| ------ | ------------------------- | ---- | ------------------- |
| GET    | `/api/categories`         | No   | List all categories |
| GET    | `/api/categories/:id`     | No   | Get category by ID  |
| POST   | `/api/categories`         | JWT  | Create category     |
| PUT    | `/api/categories/reorder` | JWT  | Reorder categories  |
| PUT    | `/api/categories/:id`     | JWT  | Update category     |
| DELETE | `/api/categories/:id`     | JWT  | Delete category     |

### Homepage Content

| Method | Path                | Auth | Description               |
| ------ | ------------------- | ---- | ------------------------- |
| GET    | `/api/home-content` | No   | Get homepage/hero content |
| PUT    | `/api/home-content` | JWT  | Update homepage content   |

### About Content

| Method | Path         | Auth | Description          |
| ------ | ------------ | ---- | -------------------- |
| GET    | `/api/about` | No   | Get about content    |
| PUT    | `/api/about` | JWT  | Update about content |

### Contact

| Method | Path           | Auth | Description         |
| ------ | -------------- | ---- | ------------------- |
| GET    | `/api/contact` | No   | Get contact info    |
| PUT    | `/api/contact` | JWT  | Update contact info |

### Contact Messages

| Method | Path                                 | Auth                      | Description            |
| ------ | ------------------------------------ | ------------------------- | ---------------------- |
| POST   | `/api/contact-messages`              | No (rate-limited: 10/15m) | Submit contact message |
| GET    | `/api/contact-messages`              | JWT                       | List all messages      |
| GET    | `/api/contact-messages/unread-count` | JWT                       | Get unread count       |
| GET    | `/api/contact-messages/:id`          | JWT                       | Get message by ID      |
| PATCH  | `/api/contact-messages/:id/read`     | JWT                       | Mark as read           |
| PATCH  | `/api/contact-messages/:id/unread`   | JWT                       | Mark as unread         |
| DELETE | `/api/contact-messages/:id`          | JWT                       | Delete message         |

### Footer Content

| Method | Path          | Auth | Description           |
| ------ | ------------- | ---- | --------------------- |
| GET    | `/api/footer` | No   | Get footer content    |
| PUT    | `/api/footer` | JWT  | Update footer content |

### Navigation

| Method | Path                      | Auth | Description              |
| ------ | ------------------------- | ---- | ------------------------ |
| GET    | `/api/navigation`         | No   | Get navigation items     |
| GET    | `/api/navbar-settings`    | No   | Get navbar settings      |
| POST   | `/api/navigation`         | JWT  | Create navigation item   |
| PUT    | `/api/navigation/:id`     | JWT  | Update navigation item   |
| DELETE | `/api/navigation/:id`     | JWT  | Delete navigation item   |
| PUT    | `/api/navigation-reorder` | JWT  | Reorder navigation items |
| PUT    | `/api/navbar-settings`    | JWT  | Update navbar settings   |

### Site Settings

| Method | Path                 | Auth | Description          |
| ------ | -------------------- | ---- | -------------------- |
| GET    | `/api/site-settings` | No   | Get site settings    |
| PUT    | `/api/site-settings` | JWT  | Update site settings |

### Settings

| Method | Path                       | Auth | Description           |
| ------ | -------------------------- | ---- | --------------------- |
| GET    | `/api/settings`            | No   | Get settings          |
| PUT    | `/api/settings`            | JWT  | Update settings       |
| GET    | `/api/settings/appearance` | No   | Get appearance config |
| PATCH  | `/api/settings/appearance` | JWT  | Update appearance     |

### Media

| Method | Path                         | Auth              | Description               |
| ------ | ---------------------------- | ----------------- | ------------------------- |
| POST   | `/api/media/upload`          | JWT + super_admin | Upload image (Cloudinary) |
| POST   | `/api/media/upload-document` | JWT + super_admin | Upload document           |
| GET    | `/api/media`                 | No                | List all media            |
| GET    | `/api/media/:id`             | No                | Get media by ID           |
| PUT    | `/api/media/:id`             | JWT + super_admin | Update media item         |
| DELETE | `/api/media/:id`             | JWT + super_admin | Delete media item         |

### Custom Pages (Admin)

| Method | Path                           | Auth              | Description           |
| ------ | ------------------------------ | ----------------- | --------------------- |
| GET    | `/api/custom-pages`            | JWT + super_admin | List all custom pages |
| POST   | `/api/custom-pages`            | JWT + super_admin | Create custom page    |
| GET    | `/api/custom-pages/:id`        | JWT + super_admin | Get custom page by ID |
| PUT    | `/api/custom-pages/:id`        | JWT + super_admin | Update custom page    |
| DELETE | `/api/custom-pages/:id`        | JWT + super_admin | Delete custom page    |
| PATCH  | `/api/custom-pages/:id/status` | JWT + super_admin | Toggle page status    |

### Custom Pages (Public)

| Method | Path                             | Auth | Description                |
| ------ | -------------------------------- | ---- | -------------------------- |
| GET    | `/api/custom-pages/public`       | No   | List published pages       |
| GET    | `/api/custom-pages/public/:slug` | No   | Get published page by slug |

### Backups

| Method | Path                        | Auth | Description         |
| ------ | --------------------------- | ---- | ------------------- |
| GET    | `/api/backups`              | JWT  | List all backups    |
| POST   | `/api/backups`              | JWT  | Create backup       |
| POST   | `/api/backups/upload`       | JWT  | Upload backup file  |
| GET    | `/api/backups/:id`          | JWT  | Get backup details  |
| GET    | `/api/backups/:id/download` | JWT  | Download backup     |
| POST   | `/api/backups/:id/restore`  | JWT  | Restore from backup |
| DELETE | `/api/backups/:id`          | JWT  | Delete backup       |

### Activity Logs

| Method | Path                         | Auth | Description                |
| ------ | ---------------------------- | ---- | -------------------------- |
| GET    | `/api/activity-logs`         | JWT  | List activity logs         |
| GET    | `/api/activity-logs/actions` | JWT  | Get available action types |
| GET    | `/api/activity-logs/export`  | JWT  | Export logs                |
| GET    | `/api/activity-logs/:id`     | JWT  | Get log by ID              |
| DELETE | `/api/activity-logs`         | JWT  | Clear all logs             |

### Import/Export

| Method | Path                            | Auth | Description         |
| ------ | ------------------------------- | ---- | ------------------- |
| GET    | `/api/import-export/export`     | JWT  | Export all data     |
| POST   | `/api/import-export/preview`    | JWT  | Preview import file |
| POST   | `/api/import-export/import`     | JWT  | Execute data import |
| POST   | `/api/import-export/import-ups` | JWT  | Import UPS snapshot |

### System Config

| Method | Path                                      | Auth | Description                   |
| ------ | ----------------------------------------- | ---- | ----------------------------- |
| GET    | `/api/system-config`                      | JWT  | Get system config             |
| PUT    | `/api/system-config`                      | JWT  | Update system config          |
| POST   | `/api/system-config/trigger-backup`       | JWT  | Manually trigger backup       |
| POST   | `/api/system-config/trigger-health-check` | JWT  | Manually trigger health check |

### Maintenance

| Method | Path                            | Auth | Description           |
| ------ | ------------------------------- | ---- | --------------------- |
| GET    | `/api/maintenance/health`       | JWT  | DB health check       |
| GET    | `/api/maintenance/storage`      | JWT  | Storage usage stats   |
| GET    | `/api/maintenance/collections`  | JWT  | Collection statistics |
| GET    | `/api/maintenance/indexes`      | JWT  | Index status          |
| GET    | `/api/maintenance/orphan-files` | JWT  | Find orphan files     |

### Security

| Method | Path                            | Auth              | Description              |
| ------ | ------------------------------- | ----------------- | ------------------------ |
| GET    | `/api/security/settings`        | JWT + super_admin | Get security settings    |
| PUT    | `/api/security/settings`        | JWT + super_admin | Update security settings |
| GET    | `/api/security/sessions`        | JWT               | Get active sessions      |
| DELETE | `/api/security/sessions/:index` | JWT               | Revoke specific session  |
| DELETE | `/api/security/sessions`        | JWT               | Revoke all sessions      |
| GET    | `/api/security/audit`           | JWT + super_admin | Run security audit       |

### Notifications

| Method | Path                               | Auth | Description            |
| ------ | ---------------------------------- | ---- | ---------------------- |
| GET    | `/api/notifications`               | JWT  | List notifications     |
| GET    | `/api/notifications/unread-count`  | JWT  | Get unread count       |
| PATCH  | `/api/notifications/:id/read`      | JWT  | Mark notification read |
| POST   | `/api/notifications/mark-all-read` | JWT  | Mark all read          |
| DELETE | `/api/notifications/:id`           | JWT  | Delete notification    |

### AI Chat

| Method | Path        | Auth                    | Description                 |
| ------ | ----------- | ----------------------- | --------------------------- |
| POST   | `/api/chat` | No (rate-limited: 30/m) | Send chat message to AI bot |

## Frontend Routes

### Public Portfolio

| Path           | Component         | Description                                 |
| -------------- | ----------------- | ------------------------------------------- |
| `/`            | Home              | Portfolio landing page with all 2D sections |
| `/3d`          | ThreeDPortfolio   | Immersive 3D scrollable portfolio           |
| `/:customSlug` | DynamicCustomPage | Admin-managed custom pages rendered by slug |

### Admin Dashboard

| Path                      | Component            | Roles              | Description                                   |
| ------------------------- | -------------------- | ------------------ | --------------------------------------------- |
| `/admin/dashboard`        | Dashboard            | All                | Overview with stat cards, recent activity     |
| `/admin/analytics`        | Analytics            | super_admin, admin | Full visitor analytics with 6 charts, filters |
| `/admin/activity-logs`    | ActivityLogs         | super_admin, admin | Admin action audit trail                      |
| `/admin/messages`         | MessageCenter        | super_admin, admin | Contact message management                    |
| `/admin/projects`         | Projects             | All                | Portfolio project list                        |
| `/admin/projects/new`     | ProjectForm          | All                | Create new project                            |
| `/admin/projects/:id`     | ProjectForm          | All                | Edit project                                  |
| `/admin/skills`           | Skills               | All                | Technology skill list                         |
| `/admin/skills/new`       | SkillForm            | All                | Create new skill                              |
| `/admin/skills/:id`       | SkillForm            | All                | Edit skill                                    |
| `/admin/custom-pages`     | CustomPagesList      | All                | Custom pages list                             |
| `/admin/custom-pages/new` | CustomPageForm       | All                | Create custom page                            |
| `/admin/custom-pages/:id` | CustomPageForm       | All                | Edit custom page                              |
| `/admin/media`            | MediaLibrary         | All                | File/image upload management                  |
| `/admin/navigation`       | NavigationManagement | All                | Navigation menu editor                        |
| `/admin/home`             | HomeContent          | All                | Hero section content editor                   |
| `/admin/about`            | AboutContent         | All                | Biography, experience, education editor       |
| `/admin/contact`          | ContactContent       | All                | Contact info & social links editor            |
| `/admin/footer`           | FooterContent        | All                | Footer content editor                         |
| `/admin/import-export`    | ImportExport         | super_admin, admin | Data import/export tools                      |
| `/admin/maintenance`      | Maintenance          | super_admin only   | DB health, indexes, orphan files              |
| `/admin/system-config`    | SystemConfig         | super_admin only   | System-wide settings                          |
| `/admin/backup`           | Backup               | super_admin, admin | Database backup & restore                     |
| `/admin/security`         | Security             | super_admin, admin | Security settings, sessions, audit            |
| `/admin/users`            | UserManagement       | super_admin only   | Admin user CRUD                               |
| `/admin/profile`          | Profile              | All                | Admin account profile                         |
| `/admin/theme`            | ThemeSettings        | super_admin, admin | Light/dark/system theme configuration         |

## Features

### 2D Portfolio

- **Sections**: Hero, About, Skills, Projects, Contact (smooth-scroll navigation)
- **Dark mode**: Persistent theme toggle with system preference support
- **Responsive**: Mobile-first with animated navbar drawer
- **Framer Motion**: Entrance animations, scroll-triggered reveals
- **i18n**: English and Amharic language support via i18next

### 3D Portfolio (`/#/3d`)

An immersive scrollable 3D experience built with Three.js / React Three Fiber:

- **Scroll-driven navigation**: HTML scroll maps to 3D scene transitions via `useScrollManager`
- **Hero Scene**: Floating 3D photo frame with glowing neon borders, orbiting rings, parallax particles, cinematic lighting
- **About Scene**: Story pillar cards, IDE-style code block with developer config, highlight metrics, certifications
- **Skills/Projects/Contact/Footer Scenes**: In progress
- **SceneEnvironment**: Dynamic starfield, fog, ambient lighting
- **ScrollIndicator**: Fixed dot navigation sidebar
- **Responsive**: Adapts particle count, text scale, camera position, and model scale by viewport
- **Performance**: `useMemo` for colors, `useRef` for mouse tracking (zero rerenders), `instancedMesh` for particles, lazy-loaded scenes

### AI Chatbot

- **Backend**: Google Generative AI integration with custom prompts
- **Frontend**: ChatWindow component with typing indicators, message history
- **Rate limiting**: 30 requests per minute per IP
- **Context-aware**: Uses portfolio data for relevant responses

### Custom Pages System

Admin-managed dynamic pages with a section-based builder:

- **Backend**: `CustomPage` model with slug, status (draft/published/inactive), `sections` array
- **Section types**: Text, Image, Gallery, Video, Button, HTML embed
- **Admin UI**: List view with search/filter/pagination, form with drag-and-drop section builder
- **Public rendering**: Slug-based routing (`/:customSlug`), responsive section layout
- **SEO**: Meta title/description support per page

### Visit Tracking

- **Automatic**: IP geolocation (country/city/region via ipapi.co)
- **Device detection**: Desktop, mobile, tablet via ua-parser-js
- **Browser/OS**: Chrome, Firefox, Safari, Edge, etc.
- **Referrer parsing**: Google, LinkedIn, GitHub, Direct, etc.
- **Returning visitors**: Anonymous visitorId persisted in localStorage
- **Admin exclusion**: `/admin` routes, `/login`, and local IPs are never tracked
- **Engagement tracking**: Scroll depth, time on page, clicks

### Admin Dashboard (2FA-protected)

- **Sidebar**: 5 navigation groups (Dashboard, Portfolio CMS, System, Account) with accordion, Cmd+K search, collapse mode, mobile drawer
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

### Security Management

- **Password Policy**: Configurable min length, character requirements, max age, reuse prevention
- **Session Management**: View active sessions with device/browser/IP info, revoke individual or all sessions
- **Two-Factor Auth**: Enforce 2FA for all users, allow authenticator app or SMS methods
- **Security Audit**: Real-time security score with 10 automated checks (password policy, 2FA, lockout, CSRF, rate limiting, etc.)
- **Login Security**: Configurable max failed attempts, lockout duration

## Deployment

### Backend (Render)

1. Push to GitHub
2. In Render dashboard → **New Web Service** → connect repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
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

### Docker

```bash
docker-compose up --build
```

## Security

- **Password hashing**: bcryptjs with 12 salt rounds
- **Two-factor authentication**: TOTP-based via speakeasy + Google Authenticator
- **JWT tokens**: httpOnly cookies with Bearer header fallback, configurable expiry
- **Refresh token rotation**: Rotating refresh tokens, max 10 stored per user
- **Account lockout**: Automatic lock after 5 failed attempts (15-minute duration)
- **CSRF protection**: HMAC-based double-submit token pattern
- **Rate limiting**: Global (200 req/15min) + per-route (login: 10/15min, 2FA: 20/15min, chat: 30/min)
- **Security headers**: Helmet.js with CSP, HSTS (1 year), XSS filter, noSniff, referrer policy
- **CORS**: Origin whitelist with credentials support
- **NoSQL injection prevention**: mongo-sanitize on all request inputs
- **Input validation**: express-validator with centralized error handling
- **Request size limits**: 10MB max for JSON and URL-encoded bodies
- **Sensitive data exclusion**: Passwords, 2FA secrets, refresh tokens stripped from API responses
- **Admin route exclusion**: `/admin/*` routes excluded from visitor analytics tracking
- **Security settings management**: Dedicated admin panel for password policy, session config, 2FA enforcement
- **Session tracking**: Active session monitoring with device/browser/IP identification
- **Security audit**: Real-time security score with automated checks
- **Graceful shutdown**: SIGTERM/SIGINT handlers for clean connection teardown
- **Port fallback**: Auto-retry next port on EADDRINUSE

## Scripts

### Backend

- `npm run dev` — Start with nodemon (auto-restart)
- `npm start` — Start for production
- `npm test` — Run Jest tests
- `npm run test:coverage` — Run tests with coverage
- `npm run seed` — Seed database with sample data

### Frontend

- `npm run dev` — Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm test` — Run Vitest tests
- `npm run test:watch` — Run tests in watch mode
- `npm run test:coverage` — Run tests with coverage

## Tech Stack

### Frontend

- React 18 + Vite
- Tailwind CSS v4
- React Router DOM v7
- Framer Motion (animations)
- Three.js + React Three Fiber (3D portfolio)
- Recharts (analytics charts)
- Lucide React (icons)
- i18next + react-i18next (i18n)
- Socket.IO Client (real-time)
- Axios (HTTP client)
- React Quill (rich text editor)

### Backend

- Express v5
- Mongoose (MongoDB ODM)
- JSON Web Tokens (JWT)
- speakeasy + qrcode (TOTP 2FA)
- bcryptjs (password hashing)
- Helmet (security headers)
- Cloudinary (media storage)
- Socket.IO (real-time)
- Google Generative AI (chatbot)
- node-cron (scheduled tasks)
- express-validator (input validation)
- mongo-sanitize (NoSQL injection prevention)

### DevTools

- Vitest + @testing-library/react (frontend tests)
- Jest (backend tests)
- nodemon (backend hot reload)
- ESLint (linting)
- Docker + Docker Compose (containerization)
