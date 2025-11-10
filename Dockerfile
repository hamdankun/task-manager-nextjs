# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps flag
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN yarn install && yarn cache clean --force

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Set ownership of app directory
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
# CMD ["yarn", "start"]
