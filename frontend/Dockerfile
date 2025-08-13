# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---------- Development ----------
FROM base AS development
RUN npm install
COPY . /app/
CMD ["npm", "run", "dev"]

# ---------- Production ----------
FROM base AS builder
RUN npm ci
COPY . /app/
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["npm", "start"]

