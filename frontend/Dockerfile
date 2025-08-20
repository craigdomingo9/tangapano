# ---------- Base ----------
FROM node:20-bullseye AS base
# Install dependencies for building native modules
RUN apt-get update && apt-get install -y libc6-dev

WORKDIR /app
COPY package*.json ./

# ---------- Development ----------
FROM base AS development
RUN npm install
COPY . /app/
CMD ["npm", "run", "dev"]

# ---------- Production ----------
# Build the application for production
FROM base AS builder
RUN npm ci
COPY . /app/
RUN npm run build

# Production image
FROM node:20-bullseye-slim AS production
WORKDIR /app
# Copy only the necessary files for a production environment.
# This includes the built app, public files, and the package.json.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

COPY package*.json ./
RUN npm install --omit=dev

CMD ["npm", "start"]

