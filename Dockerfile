# Use Node.js 20 with Alpine for smaller image size
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --include=dev --prefer-offline --no-audit

# Copy source code (this changes frequently so goes last)
COPY . .

# Build the application
RUN npm run build

# Debug: Check if build succeeded
RUN ls -la dist/ && echo "Build files:" && find dist/ -type f | head -10

# Production stage
FROM nginx:alpine

# Remove default nginx config and copy custom config
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Debug: Verify files were copied and set permissions
RUN ls -la /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html


# Expose port 8080 (non-privileged port)
EXPOSE 8080
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]