# ==========================================================
# 🎓 Government College Rajahmundry — Alumni Platform Dockerfile
# Production Multi-Stage Build
# ==========================================================

# 1. Base Node environment
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

# 2. Build Client (React + Vite)
FROM base AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# 3. Build Server (Express + TypeScript + Prisma)
FROM base AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
COPY server/prisma ./prisma/
RUN npm install
COPY server/ ./
RUN npx prisma generate
RUN npm run build

# 4. Production Runner
FROM base AS runner
WORKDIR /app/server
ENV NODE_ENV=production
ENV PORT=5000

# Copy node_modules, generated Prisma engine, and built files directly from server-builder
COPY --from=server-builder /app/server/package*.json ./
COPY --from=server-builder /app/server/node_modules ./node_modules
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/prisma ./prisma

# Copy built frontend assets
COPY --from=client-builder /app/client/dist /app/client/dist

# Create uploads directory
RUN mkdir -p /app/server/uploads

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
