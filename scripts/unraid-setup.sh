#!/bin/bash

# Unraid Environment Setup Script
# Run this once on your Unraid server to prepare for deployments

echo "🔧 Setting up Unraid environment for personal website deployment..."

# Define paths
APP_DATA_PATH="/mnt/user/appdata/personal-website"
RUNNER_DATA_PATH="/mnt/user/appdata/github_runner-personal-website"

# Create necessary directories
echo "📁 Creating application directories..."
mkdir -p "${APP_DATA_PATH}/dist"
mkdir -p "${APP_DATA_PATH}/backups"
mkdir -p "${APP_DATA_PATH}/logs"
mkdir -p "${RUNNER_DATA_PATH}/persistent_files"

# Set proper permissions
echo "🔐 Setting directory permissions..."
chmod -R 755 "${APP_DATA_PATH}"
chmod -R 755 "${RUNNER_DATA_PATH}"

# Create initial nginx config if needed
if [ ! -f "${APP_DATA_PATH}/nginx.conf" ]; then
    echo "📝 Creating initial nginx configuration..."
    cat > "${APP_DATA_PATH}/nginx.conf" << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Security
        server_tokens off;
        
        # Main location
        location / {
            try_files $uri $uri/ /index.html;
            
            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
        
        # Deny access to sensitive files
        location ~ /\. {
            deny all;
        }
    }
}
EOF
fi

# Create initial docker-compose if needed
if [ ! -f "${APP_DATA_PATH}/docker-compose.yml" ]; then
    echo "🐳 Creating initial docker-compose configuration..."
    cat > "${APP_DATA_PATH}/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  personal-website:
    container_name: personal-website
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - web
    labels:
      # Traefik labels (uncomment and configure if using Traefik)
      # - "traefik.enable=true"
      # - "traefik.http.routers.personal-website.rule=Host(`yourdomain.com`)"
      # - "traefik.http.routers.personal-website.tls=true"
      # - "traefik.http.routers.personal-website.tls.certresolver=lets-encrypt"
      # - "traefik.http.services.personal-website.loadbalancer.server.port=80"
      
      # Nginx Proxy Manager labels (uncomment if using NPM)
      # - "nginx-proxy-manager.enable=true"
      # - "nginx-proxy-manager.http.routers.personal-website.rule=Host(`yourdomain.com`)"

networks:
  web:
    external: true
EOF
fi

# Create log rotation config
echo "📊 Setting up log rotation..."
cat > "/etc/logrotate.d/personal-website" << 'EOF'
/mnt/user/appdata/personal-website/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    copytruncate
    notifempty
}
EOF

# Create monitoring script
echo "📈 Creating monitoring script..."
cat > "${APP_DATA_PATH}/monitor.sh" << 'EOF'
#!/bin/bash

# Simple monitoring script for personal website
LOG_FILE="/mnt/user/appdata/personal-website/logs/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Check if container is running
if docker ps | grep -q "personal-website"; then
    echo "[$DATE] ✅ Container is running" >> "$LOG_FILE"
    
    # Check if website is responding
    if curl -f -s http://localhost:3000/health > /dev/null; then
        echo "[$DATE] ✅ Website is healthy" >> "$LOG_FILE"
    else
        echo "[$DATE] ❌ Website health check failed" >> "$LOG_FILE"
        # Optional: Send notification
        # curl -X POST "YOUR_WEBHOOK_URL" -d '{"text":"⚠️ Personal website health check failed"}'
    fi
else
    echo "[$DATE] ❌ Container is not running" >> "$LOG_FILE"
    # Optional: Send notification
    # curl -X POST "YOUR_WEBHOOK_URL" -d '{"text":"🚨 Personal website container is down"}'
fi
EOF

chmod +x "${APP_DATA_PATH}/monitor.sh"

# Create cron job for monitoring (optional)
echo "⏰ Setting up monitoring cron job..."
(crontab -l 2>/dev/null; echo "*/5 * * * * ${APP_DATA_PATH}/monitor.sh") | crontab -

echo "✅ Unraid environment setup completed!"
echo ""
echo "📋 Setup Summary:"
echo "   • Application data: ${APP_DATA_PATH}"
echo "   • Runner data: ${RUNNER_DATA_PATH}"
echo "   • Nginx config: ${APP_DATA_PATH}/nginx.conf"
echo "   • Docker compose: ${APP_DATA_PATH}/docker-compose.yml"
echo "   • Monitoring: ${APP_DATA_PATH}/monitor.sh (runs every 5 minutes)"
echo "   • Logs: ${APP_DATA_PATH}/logs/"
echo ""
echo "🔄 Next Steps:"
echo "   1. Configure your domain in docker-compose.yml labels"
echo "   2. Set up reverse proxy (Traefik/Nginx Proxy Manager)"
echo "   3. Push to main branch to trigger first deployment"
echo "   4. Monitor logs: tail -f ${APP_DATA_PATH}/logs/monitor.log"

exit 0