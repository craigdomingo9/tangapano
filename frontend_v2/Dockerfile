# syntax=docker/dockerfile:1

# ---------- Base ----------
FROM node:20-bullseye-slim AS base
WORKDIR /app

# Install system dependencies required for some Next.js native modules (like SWC)
RUN apt-get update && apt-get install -y libc6-dev && rm -rf /var/lib/apt/lists/*

# ---------- Dependencies (New Stage) ----------
# This stage exists solely to cache dependencies
FROM base AS deps
COPY package.json package-lock.json ./

# 1. Use --mount to cache the npm cache directory (/root/.npm)
# 2. Use 'npm ci' instead of 'npm install' for exact version matching from lockfile
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---------- Development ----------
FROM base AS development
# Enable polling for hot reload (Critical for Docker on Windows/Mac)
ENV WATCHPACK_POLLING=true

ENV NODE_ENV=development

# Copy node_modules from the cached deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copy source code LAST to prevent cache invalidation of previous steps
COPY . .

# Fix permissions for Next.js cache
RUN mkdir -p /app/.next && chmod -R 777 /app/.next

CMD ["npm", "run", "dev"]

# ---------- Builder ----------
FROM base AS builder
# Copy node_modules from the cached deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# ---------- Production (Standalone) ----------
FROM node:20-bullseye-slim AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Set up a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverages output traces to reduce image size
# Ensure 'output: "standalone"' is in your next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]