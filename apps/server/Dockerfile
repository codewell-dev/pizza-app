# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests first (better layer caching)
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/server/package.json ./apps/server/

# Install only server deps
RUN pnpm install --filter server --frozen-lockfile

# Copy server source
COPY apps/server ./apps/server

# Build NestJS
RUN pnpm --filter server build

# ── Stage 2: Production ─────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/server/package.json ./apps/server/

# Install only production dependencies
RUN pnpm install --filter server --frozen-lockfile --prod

# Copy compiled output
COPY --from=builder /app/apps/server/dist ./apps/server/dist

WORKDIR /app/apps/server

EXPOSE 5000

CMD ["node", "dist/main"]
