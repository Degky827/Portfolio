# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Production backend
FROM node:18-alpine AS production
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
