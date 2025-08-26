#!/bin/bash

# Unraid Personal Website Container Setup Script
# This script helps set up the personal website container on Unraid

echo "🔧 Setting up personal website container on Unraid..."

# Define paths
APP_DATA_PATH="/mnt/user/appdata/personal-website"
COMPOSE_FILE="${APP_DATA_PATH}/docker-compose.yml"

# Create necessary directories
echo "📁 Creating application directories..."
mkdir -p "${APP_DATA_PATH}"
mkdir -p "${APP_DATA_PATH}/logs"

# Set proper permissions
echo "🔐 Setting directory permissions..."
chmod -R 755 "${APP_DATA_PATH}"

# Create docker-compose.yml if it doesn't exist
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "🐳 Creating docker-compose.yml..."
    cat > "$COMPOSE_FILE" << 'EOF'
version: '3.8'

services:
  personal-website:
    image: ghcr.io/zachyzissou/personal-website:latest
    container_name: personal-website
    restart: unless-stopped
    ports:
      - "18475:8080"    # Main web interface (nginx listens on 8080)
    environment:
      - NODE_ENV=production
      - TZ=America/New_York  # Adjust to your timezone
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - personal-website-net
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.personal-website.rule=Host(\`zachgonser.com\`)"
      - "traefik.http.services.personal-website.loadbalancer.server.port=80"

networks:
  personal-website-net:
    driver: bridge
EOF
fi

# Create deployment script
echo "📜 Creating deployment script..."
cat > "${APP_DATA_PATH}/deploy.sh" << 'EOF'
#!/bin/bash

echo "🚀 Deploying personal website container..."

cd /mnt/user/appdata/personal-website

# Pull latest image
echo "📥 Pulling latest image..."
docker-compose pull

# Stop existing container
echo "🛑 Stopping existing container..."
docker-compose down

# Start with new image
echo "🆙 Starting container..."
docker-compose up -d

# Wait for health check
echo "⏳ Waiting for health check..."
sleep 30

# Check container status
if docker ps | grep -q personal-website; then
    echo "✅ Container is running!"
    
    # Test health endpoint
    if curl -f -s http://localhost:18475/health > /dev/null 2>&1; then
        echo "✅ Health check passed!"
        echo "🌐 Website is available at: http://localhost:18475"
    else
        echo "⚠️ Health check failed, but container is running"
    fi
else
    echo "❌ Container failed to start"
    echo "🔍 Checking logs..."
    docker logs personal-website --tail 20
fi
EOF

chmod +x "${APP_DATA_PATH}/deploy.sh"

# Create update script
echo "🔄 Creating update script..."
cat > "${APP_DATA_PATH}/update.sh" << 'EOF'
#!/bin/bash

echo "🔄 Updating personal website..."

cd /mnt/user/appdata/personal-website

# Check if container is running
if docker ps | grep -q personal-website; then
    echo "📊 Current container status:"
    docker ps | grep personal-website
fi

# Pull and deploy
./deploy.sh

echo "✅ Update completed!"
EOF

chmod +x "${APP_DATA_PATH}/update.sh"

# Create monitoring script
echo "📊 Creating monitoring script..."
cat > "${APP_DATA_PATH}/monitor.sh" << 'EOF'
#!/bin/bash

LOG_FILE="/mnt/user/appdata/personal-website/logs/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Check if container is running
if docker ps | grep -q personal-website; then
    # Check health endpoint
    if curl -f -s --connect-timeout 5 "http://localhost:18475/health" > /dev/null 2>&1; then
        echo "[$DATE] ✅ Container is healthy" >> "$LOG_FILE"
    else
        echo "[$DATE] ⚠️ Health check failed" >> "$LOG_FILE"
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

echo "✅ Setup completed!"
echo ""
echo "📋 Setup Summary:"
echo "   • Application data: ${APP_DATA_PATH}"
echo "   • Docker compose: ${APP_DATA_PATH}/docker-compose.yml"
echo "   • Deploy script: ${APP_DATA_PATH}/deploy.sh"
echo "   • Update script: ${APP_DATA_PATH}/update.sh"
echo "   • Monitor script: ${APP_DATA_PATH}/monitor.sh"
echo ""
echo "🚀 To deploy the container:"
echo "   cd ${APP_DATA_PATH} && ./deploy.sh"
echo ""
echo "🔄 To update the container:"
echo "   cd ${APP_DATA_PATH} && ./update.sh"
echo ""
echo "📊 Monitor logs:"
echo "   tail -f ${APP_DATA_PATH}/logs/monitor.log"
echo ""
echo "🌐 Access website: http://your-unraid-ip:18475"