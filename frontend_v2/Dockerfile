# syntax=docker/dockerfile:1

# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app

# Install libc6-compat for Next.js native modules (SWC) on Alpine
RUN apk add --no-cache libc6-compat

# ---------- Dependencies ----------
FROM base AS deps
COPY package*.json ./
# Cache mount for faster installs
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---------- Development ----------
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY . .
# Fix permissions for Next.js cache
RUN mkdir -p /app/.next && chown -R node:node /app/.next
USER node
CMD ["npm", "run", "dev", "--", "--turbopack"]

# ---------- Builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Production (Hardened) ----------
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary assets only
COPY --from=builder /app/public ./public

# Set permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 🔒 RUN AS NON-ROOT
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]