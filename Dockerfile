FROM node:20-alpine AS builder

WORKDIR /app

# Cache de dependências
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile || npm install

# Código fonte
COPY . .

# Build standalone (Next.js) com patch do eisdir
RUN node -r ./scripts/patch-eisdir.cjs ./node_modules/next/dist/bin/next build

# ============================================

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Segurança: não rodar como root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar standalone output
COPY --from=builder /app/.next/standalone ./

# Copiar assets estáticos (necessário para standalone)
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copiar scripts necessários em runtime
COPY --from=builder /app/scripts ./scripts

# Ajustar server.js se o patch-eisdir foi usado no build (runtime pode precisar)
# O .next/standalone/server.js já inclui tudo, inclusive o patch foi apenas para build
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
