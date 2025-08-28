# ---------- Base ----------
FROM node:20-bullseye AS base
WORKDIR /app
# Install dependencies for building native modules
RUN apt-get update && apt-get install -y libc6-dev && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# ---------- Development ----------
FROM base AS development
# Install all dependencies (including dev)
RUN npm install
COPY . /app
CMD ["npm", "run", "dev"]

# ---------- Builder (for production only) ----------
FROM base AS builder
# Install clean dependencies
RUN npm ci
COPY . /app
RUN npm run build --no-lint

# ---------- Production ----------
FROM node:20-bullseye-slim AS production
WORKDIR /app

# Copy only what's needed for runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Install only prod dependencies (omit dev)
RUN npm install --omit=dev --ignore-scripts --prefer-offline

EXPOSE 3000
CMD ["npm", "start"]

