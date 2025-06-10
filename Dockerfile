# Step 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json ./
# Optional: COPY package-lock.json ./ if you have it
RUN npm install

# Step 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Step 3: Run the app in production
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

EXPOSE 4000
CMD ["npm", "start"]
