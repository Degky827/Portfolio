# Backend Architecture Documentation

## 1. Project Overview

### Purpose

This backend powers a personal portfolio website and its admin panel. It serves two audiences:

- **Public visitors** — browse projects, skills, about page, contact form
- **Admin users** — manage content, view analytics, configure the system, create backups

### Technologies

| Technology | Role |
|------------|------|
| Node.js | JavaScript runtime |
| Express 5 | HTTP framework |
| MongoDB + Mongoose | Database + ODM |
| JSON Web Tokens (JWT) | Authentication |
| Speakeasy + QRCode | Two-factor authentication |
| Multer | File upload handling |
| Cloudinary (optional) | Cloud image storage |
| node-cron | Scheduled backup tasks |

### High-Level Architecture

```
┌──────────────────────┐     ┌──────────────────────┐
│   Public Portfolio   │     │    Admin Dashboard   │
│   (Vercel/React)     │     │   (React Frontend)   │
└──────┬───────────────┘     └──────────┬───────────┘
       │                                │
       └──────────────┬─────────────────┘
                      │ HTTP/JSON
                      ▼
              ┌───────────────┐
              │  Express API  │
              │  (src/server) │
              └───────┬───────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
   Public Routes  Admin Routes  Infrastructure
   (portfolio     (dashboard     (DB, storage,
    content)       management)    config)
         │            │            │
         └────────────┼────────────┘
                      ▼
              ┌───────────────┐
              │    MongoDB    │
              └───────────────┘
```

## 2. Folder Structure

```
backend/
├── src/
│   ├── server.js                    # Entry point, mounts all routes
│   ├── public/                      # Public portfolio APIs
│   │   ├── homepage/                # Hero, about preview, CTA
│   │   ├── about/                   # Full about page content
│   │   ├── skills/                  # Skills + categories
│   │   ├── projects/                # Portfolio projects
│   │   ├── contact/                 # Contact info + messages
│   │   ├── footer/                  # Footer content
│   │   └── settings/                # Global settings + appearance
│   ├── admin/                       # Admin panel APIs
│   │   ├── auth/                    # Login, 2FA, sessions
│   │   ├── users/                   # User management
│   │   ├── analytics/               # Visitor tracking & stats
│   │   ├── media/                   # File uploads
│   │   ├── backups/                 # Backup & restore
│   │   ├── import-export/           # Data import/export
│   │   ├── system/                  # System configuration
│   │   ├── activity-logs/           # Audit trail
│   │   ├── maintenance/             # Health checks & storage
│   │   └── notifications/           # Admin alerts
│   ├── shared/                      # Shared across the system
│   │   ├── models/                  # 16 Mongoose models
│   │   ├── middleware/              # Auth middleware
│   │   ├── services/                # Backup scheduler, health monitor
│   │   └── utilities/               # IP lookup, user-agent parsing
│   └── infrastructure/              # Low-level plumbing
│       ├── config/                  # Environment config
│       ├── database/                # MongoDB connection
│       └── storage/                 # File upload (local + Cloudinary)
├── scripts/                         # Utility scripts
├── uploads/                         # Locally stored files
├── backups/                         # JSON backup files
└── package.json                     # Dependencies & scripts
```

## 3. Public Portfolio Modules

These modules serve data to the public-facing portfolio website.

### homepage/

**Purpose:** Manages the hero section, about preview, call-to-action buttons, social links, resume download, and SEO metadata for the landing page.

| File | Purpose |
|------|---------|
| `homepage.controller.js` | `getHomeContent` returns all homepage data (with social key filtering); `updateHomeContent` saves changes |
| `homepage.routes.js` | `GET /` (public), `PUT /` (requires auth) |

### about/

**Purpose:** The full about page — biography, story pillars, education timeline, work experience, certifications, and highlight metrics.

| File | Purpose |
|------|---------|
| `about.controller.js` | `getAboutContent` fetches the single about document; `updateAboutContent` saves it with profile image upload support |
| `about.routes.js` | `GET /` (public), `PUT /` (auth + file upload) |

### skills/

**Purpose:** Skills inventory with categories, proficiency levels, and certificate entries.

| File | Purpose |
|------|---------|
| `skills.controller.js` | Full CRUD for skills + `migrateOldCategories` helper |
| `skills.routes.js` | `GET /` (public), `POST /`, `PUT /:id`, `DELETE /:id` (auth) |
| `categories.controller.js` | Full CRUD for skill/certificate categories |
| `categories.routes.js` | `GET /` (public), `POST /`, `PUT /:id`, `DELETE /:id` (auth) |

### projects/

**Purpose:** Portfolio project showcase with search, pagination, categories, featured/archive toggles, and reordering.

| File | Purpose |
|------|---------|
| `projects.controller.js` | Full CRUD, duplicate, toggle featured/publish/archive, reorder, update images |
| `projects.routes.js` | `GET /`, `GET /:id`, `GET /slug/:slug` (public), all mutations require super_admin |

### contact/

**Purpose:** Contact page configuration and visitor message handling.

| File | Purpose |
|------|---------|
| `contact.controller.js` | Contact page content (email, phone, social channels) |
| `contact.routes.js` | `GET /` (public), `PUT /` (auth) |
| `contact-messages.controller.js` | Visitor form submissions — CRUD, mark read, unread count |
| `contact-messages.routes.js` | `POST /` (public), all others (auth) |

### footer/

**Purpose:** Footer content — branding, quick links, social icons, copyright.

| File | Purpose |
|------|---------|
| `footer.controller.js` | Get/update footer content with logo upload |
| `footer.routes.js` | `GET /` (public), `PUT /` (auth + file upload) |

### settings/

**Purpose:** Global website settings — branding, social links, appearance mode, and per-page configuration.

| File | Purpose |
|------|---------|
| `settings.controller.js` | Get/update all settings; `getGlobalAppearance` / `updateGlobalAppearance` for theme sync |
| `settings.routes.js` | `GET /` (public), `PUT /` (auth), `GET /appearance` (public), `PATCH /appearance` (public) |

## 4. Admin Manager Modules

These modules power the admin dashboard. All require authentication.

### auth/

**Purpose:** Two-step login with JWT + 2FA.

| File | Purpose |
|------|---------|
| `auth.controller.js` | `loginStep1` (verify password) → `verify2FA` (verify TOTP → issue JWT cookie); also: logout, refresh, getMe, setup/verify/disable 2FA |
| `auth.routes.js` | Login routes are rate-limited; `/me` route also supports profile updates via users controller |

**Flow:**
```
POST /login  (email + password)
  → rate-limited, validate credentials, check lockout
  → 200 { require2FA: true }

POST /verify-2fa  (email + totpCode)
  → rate-limited, verify TOTP
  → 200 sets httpOnly JWT cookie
  → All subsequent requests authenticated via cookie
```

### users/

**Purpose:** Manage admin users.

| File | Purpose |
|------|---------|
| `users.controller.js` | CRUD, role management, activate/deactivate, password change; `updateMe` syncs name/avatar/location to public portfolio (HomeContent + AboutContent) |
| `users.routes.js` | All routes require super_admin. `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` |

### analytics/

**Purpose:** Visitor tracking and dashboard statistics.

| File | Purpose |
|------|---------|
| `analytics.controller.js` | `logVisit` (public), `logEngagement` (public), `getMetrics` (paginated visits), `getDashboardStats` (totals), `getAnalyticsDashboard` (trends, devices, countries, sources) |
| `analytics.routes.js` | `POST /log-visit` and `POST /log-engagement` are public; `GET /metrics`, `GET /stats`, `GET /analytics-dashboard` require auth |

### media/

**Purpose:** File uploads and management.

| File | Purpose |
|------|---------|
| `media.controller.js` | Upload images/documents, list with search/filter, update metadata, delete (with Cloudinary cleanup) |
| `media.routes.js` | Upload routes require super_admin; `GET /` is public for listing; `PUT /:id` and `DELETE /:id` require super_admin |

### backups/

**Purpose:** Create, download, upload, and restore full system backups.

| File | Purpose |
|------|---------|
| `backups.controller.js` | Full CRUD + `uploadBackup` (file-based restore), `restoreBackup` (DB restore with auto restore point), `createAutoRestorePoint` |
| `backups.routes.js` | All require auth. `POST /` (create), `POST /upload` (file), `POST /:id/restore` |

### import-export/

**Purpose:** Export portfolio data (JSON/CSV/UPS snapshot) and import with preview.

| File | Purpose |
|------|---------|
| `import-export.controller.js` | `exportData` (projects, skills, or UPS snapshot); `previewImport` (validate before committing); `executeImport` (bulk insert); `importUPSSnapshot` |
| `import-export.routes.js` | All require auth. `GET /export`, `POST /preview`, `POST /import`, `POST /import-ups` |

### system/

**Purpose:** System-level configuration and background service control.

| File | Purpose |
|------|---------|
| `system.controller.js` | Get/update system config (backup schedule, health monitor, maintenance mode), trigger backup/health check |
| `system.routes.js` | All require auth. `GET /`, `PUT /`, `POST /trigger-backup`, `POST /trigger-health-check` |

### activity-logs/

**Purpose:** Security audit trail of all admin actions.

| File | Purpose |
|------|---------|
| `activity-logs.controller.js` | List logs with search/filter/date range, get single log, export (JSON/CSV), get distinct action types |
| `activity-logs.routes.js` | All require auth. `GET /`, `GET /:id`, `GET /export`, `GET /actions` |

### maintenance/

**Purpose:** Database health checks, storage analysis, and orphan file detection.

| File | Purpose |
|------|---------|
| `maintenance.controller.js` | `healthCheck` (MongoDB ping), `storageUsage` (DB stats), `collectionStats` (per-collection), `indexStatus` (indexes), `orphanFiles` (unreferenced uploads) |
| `maintenance.routes.js` | All require auth. `GET /health`, `GET /storage`, `GET /collections`, `GET /indexes`, `GET /orphan-files` |

### notifications/

**Purpose:** Admin notification system for system events.

| File | Purpose |
|------|---------|
| `notifications.controller.js` | `createNotification` (helper used by other modules), list, unread count, mark read, mark all read, delete |
| `notifications.routes.js` | All require auth. `GET /`, `GET /unread-count`, `PATCH /:id/read`, `POST /mark-all-read`, `DELETE /:id` |

## 5. Shared Layer

### shared/models/ (16 models)

All database schemas live here. Every controller imports models from this directory.

| Model | Stores |
|-------|--------|
| `HomeContent` | Hero section, about preview, CTA, social links, SEO |
| `AboutContent` | Story pillars, education, experience, certifications |
| `Skill` | Skills with proficiency, category, certificate data |
| `Category` | Skill/certificate taxonomy |
| `Project` | Portfolio projects with slug, images, SEO |
| `ContactContent` | Contact page email, phone, social channels |
| `ContactMessage` | Visitor form submissions |
| `FooterContent` | Brand name, links, social icons, copyright |
| `Settings` | Global appearance, branding, social links |
| `User` | Admin accounts, passwords, roles, 2FA |
| `AuditLog` | Security events (login, CRUD, lockout) |
| `Visit` | Analytics (page views, geo, device) |
| `Backup` | Backup records with full data snapshots |
| `Media` | Uploaded file metadata |
| `Notification` | System notifications for admin |
| `SystemConfig` | Backup schedule, health monitor, maintenance mode |

### shared/middleware/auth.js

Two middleware functions protect all admin routes:

1. **`authenticateToken`** — Extracts JWT from cookie or `Authorization` header, verifies it, fetches the user from DB, checks they are active and not locked out. Sets `req.user`.

2. **`authorizeSuperAdmin`** — Checks `req.user.role === 'super_admin'`. Called after `authenticateToken` on sensitive routes.

### shared/services/

| Service | Purpose |
|---------|---------|
| `backupScheduler.js` | Cron-based auto-backup using `node-cron`. Triggered by system config. Gathers all content collections into a JSON snapshot. |
| `healthMonitor.js` | Periodic MongoDB ping + latency check. Sends webhook alerts (Discord/Slack) on failure or recovery. |
| `s3Uploader.js` | Uploads files to S3-compatible storage. |
| `webhookNotifier.js` | Sends HTTP webhook notifications to Discord, Slack, or custom URLs. |

### shared/utilities/

| Utility | Purpose |
|---------|---------|
| `ipLookup.js` | Resolves IP addresses to geographic location via ip-api.com |
| `parseUserAgent.js` | Parses browser, OS, and device type from user-agent strings |

## 6. Infrastructure Layer

### infrastructure/config/index.js

Loads environment variables from `backend/.env` using `dotenv`. Exports:

```
port, nodeEnv, mongoUri, jwtSecret, jwtExpiresIn, corsOrigins
```

Fails hard in production if `JWT_SECRET` is missing.

### infrastructure/database/db.js

Connects to MongoDB with Mongoose. Retry timeout: 5 seconds. Exits process on failure.

### infrastructure/storage/

Three files handle file uploads with a Cloudinary-first, local-fallback strategy:

| File | Role |
|------|------|
| `cloudinary.js` | Cloudinary SDK configuration + multer storage engine for cloud uploads |
| `upload.js` | Local disk multer storage → `/uploads/` folder |
| `cloudinaryUpload.js` | Smart uploader — if Cloudinary env vars are set, uses Cloudinary; otherwise falls back to local upload |

## 7. Request Lifecycle

Every API request follows this path:

```
Client (Browser / React App)
      │
      ▼
  1. HTTP Request
      │
      ▼
  2. Express Middleware Chain
     ├── cookieParser()
     ├── cors()
     └── express.json() / urlencoded()
      │
      ▼
  3. Route Matching (e.g. /api/projects)
      │
      ▼
  4. Auth Middleware (if required)
     ├── authenticateToken (JWT → req.user)
     └── authorizeSuperAdmin (role check)
      │
      ▼
  5. Controller Function
     ├── Validate input (express-validator)
     ├── Query database (Mongoose model)
     ├── Log activity (AuditLog)
     ├── Create notification (if applicable)
     └── Send JSON response
      │
      ▼
  6. JSON Response to Client
```

### Real Example: Admin Creates a Project

```
POST /api/projects
Authorization: Bearer <JWT>
Content-Type: application/json
Body: { title, shortDescription, category, ... }

  │
  ▼
server.js → matches /api/projects
  │
  ▼
projects.routes.js
  ├── authenticateToken → verifies JWT, sets req.user
  ├── authorizeSuperAdmin → checks req.user.role === 'super_admin'
  ├── express-validator → validates required fields
  └── createProject controller
       │
       ▼
       Project.create(data)
       │
       ▼
       AuditLog.create({ action: 'CREATE', resource: 'Project' })
       │
       ▼
       Notification.create({ type: 'project_created' })
       │
       ▼
       201 { success: true, project: {...} }
```

## 8. Authentication Flow

```
Admin opens login page
      │
      ▼
Step 1: POST /api/auth/login { email, password }
      │
      ├── Rate-limited (10 req / 15 min)
      ├── Check user exists & is active
      ├── Check account not locked
      ├── Compare password with bcrypt hash
      ├── Increment failed attempts on mismatch
      ├── Lock account after 5 failures (15 min)
      └── 200 { require2FA: true } on success
      │
      ▼
Step 2: POST /api/auth/verify-2fa { email, totpCode }
      │
      ├── Rate-limited (20 req / 15 min)
      ├── Verify TOTP via speakeasy
      ├── Reset failed attempts
      ├── Set lastLogin timestamp
      └── 200 sets httpOnly JWT cookie + { user }
      │
      ▼
Subsequent requests carry JWT cookie
      │
      ▼
authenticateToken middleware
  ├── Reads token from cookie or Bearer header
  ├── Verifies with JWT_SECRET
  ├── Fetches user from DB
  ├── Checks isActive & lockedUntil
  └── Sets req.user → next()
```

## 9. Portfolio Update Workflow

When an admin updates their profile, the changes automatically appear on the public portfolio:

```
Admin updates profile photo
      │
      ▼
PATCH /api/auth/me { avatar: '/uploads/new-photo.jpg' }
      │
      ▼
users.controller → updateMe
  ├── Updates User model
  ├── Syncs to HomeContent (hero.profilePhoto.url)
  └── Syncs to AboutContent (profileImage)
      │
      ▼
Public portfolio fetches GET /api/home-content
      │
      ▼
Returns updated profile photo URL
      │
      ▼
Portfolio displays new photo
```

This same sync pattern applies to: name, bio, location, and social links.

## 10. File Upload Workflow

```
Admin uploads project thumbnail
      │
      ▼
POST /api/media/upload
Content-Type: multipart/form-data (file)
      │
      ▼
media.routes.js
  ├── authenticateToken + authorizeSuperAdmin
  └── uploadSingle('file') middleware
       │
       ├── Cloudinary configured? → Upload to Cloudinary, get URL + publicId
       └── Cloudinary not configured? → Save to /uploads/ folder, get local URL
       │
       ▼
Media.create({ filename, url, fileType, ... })
      │
      ▼
201 { success: true, media: { url: '...' } }
      │
      ▼
Frontend uses the returned URL in project forms / page content
```

## 11. Backup & Restore Workflow

### Create Backup

```
POST /api/backups
      │
      ▼
backups.controller → createBackup
  ├── Check MongoDB connection
  ├── Gather all collections: projects, skills, homeContent,
  │   aboutContent, contactContent, footerContent, settings
  ├── Write JSON file to /backups/ folder with timestamp
  ├── Save record to Backup collection (excluding data for listing)
  └── Create notification
```

### Restore Backup

```
POST /api/backups/:id/restore
      │
      ▼
backups.controller → restoreBackup
  ├── Create auto restore point (safety net)
  ├── For each collection: delete all existing docs, insert backup data
  └── Create notification
```

## 12. Data Models

All 16 Mongoose models follow this pattern:

```
Model (Mongoose Schema)
  │
  ├── Field definitions (type, required, default, enum, etc.)
  ├── Validation rules (min, max, match, custom validators)
  ├── Hooks (pre-save slugify, pre-save password hashing)
  ├── Instance methods (comparePassword, toJSON)
  └── Indexes (for query performance)
```

Key relationships:
- `User` → no direct FK references; referenced by `AuditLog.user` and `Media.uploadedBy`
- `Skill.category` → string reference to `Category.title`
- `AuditLog.user` → ObjectId reference to `User`
- All content models (HomeContent, AboutContent, etc.) are singletons — one document each

## 13. API Communication Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Public Visitor                    │
│  Browser loads portfolio → React app makes API      │
│  calls to: GET /api/home-content, /api/projects,    │
│  /api/skills, /api/about, /api/contact, /api/footer │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                   Admin User                        │
│  Browser loads dashboard → React app makes          │
│  authenticated API calls to all /api/* routes       │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   Express API   │
              │  src/server.js  │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │  Public  │ │  Admin   │ │Infra/    │
   │  Routes  │ │  Routes  │ │Shared    │
   │ (no auth)│ │ (JWT req)│ │          │
   └────┬─────┘ └────┬─────┘ └────┬─────┘
        │            │            │
        └────────────┼────────────┘
                     ▼
            ┌──────────────┐
            │   MongoDB    │
            └──────────────┘
```

## 14. Module Dependency Diagram

```
                     ┌──────────────────────┐
                     │    src/server.js     │
                     │  (Express App +      │
                     │   Route Mounting)    │
                     └──┬───────┬───────┬──┘
                        │       │       │
            ┌───────────┘       │       └───────────┐
            ▼                   ▼                   ▼
   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
   │  Public Routes │  │  Admin Routes  │  │ Infrastructure │
   │  (controllers  │  │  (controllers  │  │ - config       │
   │   + routes)    │  │   + routes)    │  │ - database     │
   └───────┬────────┘  └───────┬────────┘  │ - storage      │
           │                   │            └────────────────┘
           │                   │
           └─────────┬─────────┘
                     ▼
            ┌────────────────┐
            │  Shared Layer  │
            │                │
            │  ┌──────────┐  │
            │  │  Models  │  │  ←─ All controllers depend on models
            │  │ (16)     │  │
            │  └──────────┘  │
            │  ┌──────────┐  │
            │  │ Middleware│  │  ←─ All protected routes depend on auth
            │  │ (auth)   │  │
            │  └──────────┘  │
            │  ┌──────────┐  │
            │  │ Services │  │  ←─ System config, startup
            │  │ (4)      │  │
            │  └──────────┘  │
            │  ┌──────────┐  │
            │  │Utilities │  │  ←─ Analytics controllers
            │  │ (2)      │  │
            │  └──────────┘  │
            └────────────────┘
```

## 15. Quick Developer Guide

### Adding a New Feature

1. Create a new folder under `src/public/` or `src/admin/`
2. Create `*.controller.js` with handler functions
3. Create `*.routes.js` with route definitions and middleware
4. If a new database collection is needed, create a model in `src/shared/models/`
5. Mount the routes in `src/server.js`

### Authentication Rules

| Decorator | Access |
|-----------|--------|
| No middleware | Public (anyone can call) |
| `authenticateToken` | Any logged-in admin |
| `authenticateToken` + `authorizeSuperAdmin` | Only super_admin role |

### File Upload Rules

- Images: 5MB limit (local), 10MB limit (Cloudinary)
- Documents: 20MB limit
- Allowed types: jpg, jpeg, png, gif, webp, svg
- Cloudinary env vars must be set for cloud uploads; otherwise falls back to `/uploads/` folder

### Environment Variables (backend/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/portkiro` |
| `JWT_SECRET` | JWT signing key | **required in production** |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:5173` |
| `CLOUDINARY_*` | Cloudinary credentials (optional) | — |

### Scripts

| Command | Action |
|---------|--------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm run seed` | Seed admin user (checks for existing) |

## 16. Summary

### How the Backend Works

The backend is an Express API organized by **feature domain** rather than by technical layer. Each feature (homepage, projects, auth, backups) has its own folder containing both the controller (business logic) and routes (HTTP mapping).

### How Admin and Public Systems Communicate

- Admin updates content via authenticated API calls
- The public portfolio reads the same data via unauthenticated GET requests
- Profile changes (name, avatar, bio, location) auto-sync via `updateMe` to the public content models
- Theme mode changes sync via the `/settings/appearance` endpoint

### Key Design Decisions

- **Feature-based structure** — Easier to navigate than a flat controllers/routes split
- **Shared models** — All database schemas live in one place, avoiding circular imports
- **Cloudinary with local fallback** — Works in development without cloud credentials
- **Two-step login with 2FA** — Password first, then TOTP; JWT issued as httpOnly cookie
- **Auto restore points** — Every manual restore first creates a safety snapshot
- **Background services** — Backup scheduler and health monitor start with the server

### Future Scalability

- New public page? Add a folder under `src/public/`
- New admin feature? Add a folder under `src/admin/`
- New storage backend (S3, GCS)? Add it to `src/infrastructure/storage/`
- New background job? Add a service to `src/shared/services/`
