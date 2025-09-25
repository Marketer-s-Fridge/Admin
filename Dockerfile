# ---- build ----
    FROM node:18-bookworm-slim AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --omit=dev=false
    COPY . .
    ENV NEXT_TELEMETRY_DISABLED=1
    RUN npm run build
    
    # ---- run ----
    FROM node:18-bookworm-slim AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    ENV PORT=3001          # ✅ 관리자 포트 다르게
    RUN useradd -m nextjs
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/public ./public
    RUN mkdir -p /app/.next/cache && chown -R nextjs:nextjs /app/.next
    RUN chmod -R a+rX /app/public
    USER nextjs
    EXPOSE 3001
    CMD ["node", "server.js"]
    