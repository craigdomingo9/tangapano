# Build phase
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

# Production phase
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json .

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BACKEND_URL=http://backend:8000/api
EXPOSE 3000
CMD ["npm", "run", "start"]
