# Base image for installing dependencies
FROM node:18-alpine AS deps
WORKDIR /app7878

# Install only if package files change
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM node:18-alpine AS builder
WORKDIR /app7878
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Final image for production runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Only production deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
