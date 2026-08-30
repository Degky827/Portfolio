# Portkiro

Full-stack portfolio CMS with a 2FA-protected admin dashboard, real-time analytics, AI chatbot, and 3D scrollable portfolio.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS v4, React Router v7, Three.js, Framer Motion, Recharts, i18next |
| Backend | Express v5, Mongoose, MongoDB, JWT + TOTP 2FA, Socket.IO, Google Generative AI |
| DevOps | Docker, Docker Compose, Nginx, GitHub Actions |

## Quick Start

### Docker (recommended)

```bash
git clone https://github.com/Degky827/Portfolio.git
cd Portfolio
cp .env.docker .env   # edit with your values
docker compose up -d
```

- App: http://localhost:5001
- API Docs: http://localhost:5001/api/docs
- MongoDB Express (dev): http://localhost:8081

### Local Development

```bash
# Backend
cd backend && cp .env.example .env   # fill in values
npm install && npm run dev

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Environment Variables

See `.env.docker` for all variables. Required:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Random 64-char hex string (`openssl rand -hex 32`) |
| `FRONTEND_URL` | Frontend origin for CORS |

Optional: `GOOGLE_CLIENT_ID`, `CLOUDINARY_*`, `GEMINI_API_KEY`.

## Architecture

```
backend/
├── src/admin/          Admin API modules (auth, analytics, backups, media, ...)
├── src/public/         Public API modules (projects, skills, about, contact, ...)
├── src/ai/             AI chatbot (Google Generative AI)
├── src/shared/         Middleware, models (23 schemas), utilities
└── src/infrastructure/ Config, database, Socket.IO, storage

frontend/
├── src/admin-manager/  Admin dashboard (26 modules)
├── src/public-portfolio/  Portfolio pages + 3D engine (Three.js)
├── src/ai/             Chat widget
├── src/shared/         Hooks, services, context, utils
└── src/locales/        i18n (English, Amharic)
```

## API

124 endpoints across 26 tag groups. Interactive documentation at `/api/docs` (Swagger UI).

## Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Backend | Render | Root: `backend`, Start: `node src/server.js` |
| Frontend | Vercel | Root: `frontend`, Framework: Vite |
| Docker | Any | `docker compose --profile prod up -d --build` |

## Scripts

```bash
# Backend
npm run dev          # nodemon
npm start            # production
npm test             # jest

# Frontend
npm run dev          # vite
npm run build        # production build
npm test             # vitest
```

## Security

- bcryptjs (12 rounds) + TOTP 2FA (speakeasy)
- JWT httpOnly cookies + refresh token rotation
- Rate limiting (global + per-route), CSRF, Helmet headers
- mongo-sanitize, input validation (express-validator)
- Account lockout, session management, security audit

## License

ISC
