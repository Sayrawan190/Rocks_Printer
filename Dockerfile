FROM node:20-alpine AS client-builder

WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS production

ENV NODE_ENV=production \
    PORT=3001

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY db.js server.js ./
COPY services ./services
COPY --from=client-builder /app/public ./public
RUN mkdir -p /data/uploads && chown -R node:node /data

USER node
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/healthz >/dev/null || exit 1

CMD ["node", "server.js"]
