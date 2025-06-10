# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app4848

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app4848
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js build
RUN npm run build

# Production image, copy all necessary files and run the server
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Install only production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

EXPOSE 4000

CMD ["npm", "start"]
