# Modernize-Portifolio

A full-stack MERN portfolio for Desalegn Kasaye — React frontend with Tailwind CSS + Express/MongoDB backend with 2FA-protected analytics dashboard.

## Architecture

```
modernize-portifo/
├── frontend/          React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   UI components (Navbar, Footer, sections)
│   │   ├── hooks/        Custom hooks (dark mode, scroll, tracking)
│   │   ├── pages/        Route pages (Home, Login, Admin)
│   │   ├── context/      Auth state management
│   │   └── services/     Axios API client with JWT interceptor
│   └── dist/             Production build
├── backend/           Express + Mongoose + MongoDB Atlas
│   ├── routes/        auth.js, analytics.js
│   ├── middleware/     JWT authentication middleware
│   ├── controllers/   Route handlers for visit tracking
│   ├── models/        Admin, Visit Mongoose schemas
│   ├── config/        DB connection, env-based config
│   └── utils/         IP geolocation, user-agent parsing
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

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Server health check |
| POST | `/api/analytics/log-visit` | No | Log a portfolio visit (with location + device data) |
| GET | `/api/analytics/metrics` | JWT | Get visit statistics (protected) |
| POST | `/api/auth/register-admin` | No | One-time admin registration |
| GET | `/api/auth/setup-2fa` | No | Generate TOTP secret + QR code |
| POST | `/api/auth/admin-login` | No | Two-phase login (password → 2FA → JWT) |

## Frontend Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Portfolio landing page with all sections |
| `/login` | Login | Two-step admin sign-in (credentials + 2FA) |
| `/admin` | Admin | Secure analytics dashboard |

## Features

- **Portfolio sections**: Hero, About, Skills, Projects, Contact (smooth-scroll navigation)
- **Dark mode**: Persistent theme toggle
- **Visit tracking**: Automatic IP geolocation, device/browser/OS detection
- **Admin dashboard**: 2FA-protected analytics with:
  - Total view count
  - Visit history table (When / Who / Where / Device / Browser-OS)
- **Responsive design**: Mobile-first with animated navbar drawer
- **Framer Motion animations**: Entrance animations, scroll-triggered reveals

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
- JWT tokens for session management (configurable expiry)
- JWT auth middleware protects the analytics metrics endpoint
- Admin password and 2FA secret are never exposed in API responses

## Scripts

### Backend

- `npm run dev` — Start with nodemon (auto-restart)
- `npm start` — Start for production

### Frontend

- `npm run dev` — Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
