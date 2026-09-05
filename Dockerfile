# Stage 1: Build frontend (Node 20+ required by @tailwindcss/oxide)
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ ./
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_API_URL
ARG VITE_SOCKET_URL
RUN npm run build

# Stage 2: Production backend
FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci --legacy-peer-deps --omit=dev && npm cache clean --force

COPY backend/ ./

COPY --from=frontend-builder /app/frontend/dist ./public

RUN mkdir -p uploads backups

EXPOSE 5000

USER node

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
