FROM node:20-alpine AS base
 
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install turbo --global
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune api --docker 

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install
 
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
 
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

# Build the project
COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=api...

RUN npm ci --omit=dev && npm cache clean --force

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs
 
COPY --chown=node:node --from=installer /app/node_modules ./node_modules
COPY --chown=node:node --from=installer /app/apps/api/dist ./apps/api/dist

CMD [ "node", "apps/api/dist/main.js" ]

# COPY --from=installer /app/apps/web/next.config.js .
# COPY --from=installer /app/apps/web/package.json .
 
# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
# COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
 
# CMD node apps/web/server.js