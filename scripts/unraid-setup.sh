#!/bin/bash

# Unraid Personal Website Container Setup Script
# Sets up the personal website container with essential configurations

echo "🔧 Setting up personal website container on Unraid..."

# Define paths
APP_DATA_PATH="/mnt/user/appdata/personal-website"
COMPOSE_FILE="${APP_DATA_PATH}/docker-compose.yml"

# Create necessary directories
echo "📁 Creating application directories..."
mkdir -p "${APP_DATA_PATH}/logs"
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
      - "18475:8080"    # Web interface (nginx listens on 8080)
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

networks:
  personal-website-net:
    driver: bridge
EOF
fi

# Create simple deployment script
echo "📜 Creating deployment script..."
cat > "${APP_DATA_PATH}/deploy.sh" << 'EOF'
#!/bin/bash
echo "🚀 Deploying personal website container..."
cd /mnt/user/appdata/personal-website

# Pull latest image with fallback instructions
echo "📥 Pulling latest image..."
if ! docker-compose pull; then
    echo "❌ Failed to pull image. The GitHub package may be private."
    echo "🔧 Fix options:"
    echo "   1. Make package public in GitHub settings"
    echo "   2. Login: docker login ghcr.io -u USERNAME"
    echo "   3. Build locally from source"
    echo "   See UNRAID_DEPLOYMENT.md for details"
    exit 1
fi

# Deploy container
docker-compose down
docker-compose up -d

# Quick health check
echo "⏳ Waiting for container to start..."
sleep 15
if docker ps | grep -q personal-website; then
    echo "✅ Container is running!"
    echo "🌐 Website available at: http://$(hostname -I | cut -d' ' -f1):18475"
else
    echo "❌ Container failed to start. Check logs:"
    echo "   docker logs personal-website"
fi
EOF
chmod +x "${APP_DATA_PATH}/deploy.sh"

echo "✅ Setup completed!"
echo ""
echo "📋 What was created:"
echo "   • Docker Compose: ${APP_DATA_PATH}/docker-compose.yml"
echo "   • Deploy script: ${APP_DATA_PATH}/deploy.sh"
echo "   • Logs directory: ${APP_DATA_PATH}/logs"
echo ""
echo "🚀 To deploy:"
echo "   cd ${APP_DATA_PATH} && ./deploy.sh"
echo ""
echo "🌐 Access: http://your-unraid-ip:18475"
echo "🔍 Troubleshooting: Run 'scripts/check-container.sh' if issues occur"