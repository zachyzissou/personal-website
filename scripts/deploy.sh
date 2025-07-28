#!/bin/bash

# Personal Website Deployment Script for Unraid Self-Hosted Runner
# This script handles deployment to the Unraid server via the mounted volume

set -e

echo "🚀 Starting deployment process..."

# Environment variables
DEPLOY_TARGET="/deploy-target"
CONTAINER_NAME="personal-website"
IMAGE_NAME="personal-website:latest"
BACKUP_DIR="/deploy-target/backups"

# Create necessary directories
mkdir -p "${DEPLOY_TARGET}/dist"
mkdir -p "${BACKUP_DIR}"

echo "📁 Deployment target: ${DEPLOY_TARGET}"
echo "🐳 Container name: ${CONTAINER_NAME}"

# Backup current deployment if it exists
if [ -d "${DEPLOY_TARGET}/dist" ] && [ "$(ls -A ${DEPLOY_TARGET}/dist)" ]; then
    echo "💾 Creating backup of current deployment..."
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"
    cp -r "${DEPLOY_TARGET}/dist"/* "${BACKUP_DIR}/${BACKUP_NAME}/"
    echo "✅ Backup created: ${BACKUP_DIR}/${BACKUP_NAME}"
    
    # Keep only last 5 backups (but don't change working directory)
    (cd "${BACKUP_DIR}" && ls -t | tail -n +6 | xargs -r rm -rf)
fi

# Copy source files and configs to deployment target
echo "📦 Copying source files to deployment target..."
echo "🔍 Current working directory: $(pwd)"

# Copy entire project to deployment target (Docker will handle the build)
echo "📂 Copying project files..."
echo "🔍 Checking for package-lock.json in source:"
ls -la package-lock.json || echo "❌ package-lock.json not found in source"

# Use rsync if available, otherwise fall back to cp
if command -v rsync >/dev/null 2>&1; then
    rsync -av --exclude=node_modules --exclude=.git --exclude=.github . "${DEPLOY_TARGET}/"
else
    # Create target directory structure
    mkdir -p "${DEPLOY_TARGET}"
    # Copy files excluding certain directories
    find . -type f -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.github/*" -exec cp --parents {} "${DEPLOY_TARGET}/" \;
    # Copy directories (except excluded ones)
    find . -type d -not -path "./node_modules*" -not -path "./.git*" -not -path "./.github*" -exec mkdir -p "${DEPLOY_TARGET}/{}" \;
fi

echo "🔍 Verifying package-lock.json in deployment target:"
ls -la "${DEPLOY_TARGET}/package-lock.json" || echo "❌ package-lock.json not found in deployment target"

echo "✅ Files copied to deployment target"

# Update docker-compose for production
echo "🔧 Configuring for production deployment..."
cd "${DEPLOY_TARGET}"

# Remove existing container completely to avoid name conflicts
echo "🧹 Removing any existing container with name ${CONTAINER_NAME}..."
docker rm -f "${CONTAINER_NAME}" || true

# Stop any running docker-compose services
echo "🛑 Stopping existing docker-compose services..."
docker-compose down --timeout 30 || true

# Build and start the new container
echo "🏗️ Building and starting container..."
docker-compose up -d --build

# Wait for container to be ready and fully initialized
echo "⏳ Waiting for container to be ready and fully initialized..."
sleep 20

# Check if container is actually running
echo "🔍 Checking container status..."
docker ps | grep personal-website || echo "❌ Container not found in running state"

# Health check
echo "🔍 Running health check..."
HEALTH_CHECK_URL="http://localhost:18475/health"
MAX_ATTEMPTS=10
ATTEMPT=1

# Test internal health first
echo "🔍 Testing internal container health..."
if docker exec personal-website curl -f -s "http://localhost:8080/health" > /dev/null 2>&1; then
    echo "✅ Internal health check passed"
else
    echo "❌ Internal health check failed"
fi

# Test external connectivity
echo "🔍 Testing external connectivity to port 18475..."
if curl -f -s --connect-timeout 10 --max-time 15 "http://localhost:18475/" > /dev/null 2>&1; then
    echo "✅ Port 18475 is responding"
else
    echo "⚠️ Port 18475 not responding yet, will retry with health check..."
fi

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "⏳ Health check attempt $ATTEMPT/$MAX_ATTEMPTS..."
    
    # Check if container is healthy using Docker's built-in health check
    CONTAINER_HEALTH=$(docker inspect personal-website --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
    
    if [ "$CONTAINER_HEALTH" = "healthy" ]; then
        echo "✅ Docker health check passed! Container is healthy."
        
        # Try external connectivity as confirmation
        if curl -f -s --connect-timeout 5 --max-time 10 "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
            echo "✅ External health endpoint also accessible!"
        elif curl -f -s --connect-timeout 5 --max-time 10 "http://localhost:18475/" > /dev/null 2>&1; then
            echo "✅ External root endpoint accessible!"
        else
            echo "⚠️ External connectivity test failed, but container is healthy internally - likely network config issue in CI environment"
        fi
        break
    fi
    
    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        echo "❌ Health check failed after $MAX_ATTEMPTS attempts"
        echo "🔍 Container health status: $CONTAINER_HEALTH"
        echo "🔍 Container logs for debugging:"
        docker logs personal-website --tail 30 || echo "Could not get container logs"
        echo "🔍 Checking nginx process inside container:"
        docker exec personal-website ps aux | grep nginx || echo "Could not check nginx process"
        echo "🔍 Testing internal nginx connection:"
        docker exec personal-website curl -f http://localhost:8080/health || echo "Internal nginx connection failed"
        echo "🔍 Checking nginx config:"
        docker exec personal-website nginx -t || echo "Nginx config test failed"
        echo "🔄 Rolling back to previous version..."
        
        # Rollback logic
        if [ -d "${BACKUP_DIR}" ] && [ "$(ls -A ${BACKUP_DIR})" ]; then
            LATEST_BACKUP=$(ls -t "${BACKUP_DIR}" | head -1)
            if [ -n "$LATEST_BACKUP" ]; then
                echo "📥 Rolling back to: ${LATEST_BACKUP}"
                rm -rf "${DEPLOY_TARGET}/dist"/*
                cp -r "${BACKUP_DIR}/${LATEST_BACKUP}"/* "${DEPLOY_TARGET}/dist/"
                docker-compose up -d --build
                echo "🔄 Rollback completed"
            fi
        fi
        exit 1
    fi
    
    echo "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS failed (container health: $CONTAINER_HEALTH), retrying in 3 seconds..."
    sleep 3
    ATTEMPT=$((ATTEMPT + 1))
done

# Cleanup old Docker images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

# Log deployment info
echo "📝 Logging deployment info..."
cat > "${DEPLOY_TARGET}/deployment-info.txt" << EOF
Deployment Information
=====================
Date: $(date)
Git Commit: ${GITHUB_SHA:-"unknown"}
Git Branch: ${GITHUB_REF_NAME:-"unknown"}
Runner: ${RUNNER_NAME:-"unknown"}
Container: ${CONTAINER_NAME}
Image: ${IMAGE_NAME}
Status: SUCCESS
EOF

echo "🎉 Deployment completed successfully!"
echo "🌐 Your personal website is now live!"

# Optional: Send notification (uncomment if you have notification setup)
# curl -X POST "YOUR_WEBHOOK_URL" -H "Content-Type: application/json" \
#   -d '{"text":"✅ Personal website deployed successfully!"}'

exit 0