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
    
    # Keep only last 5 backups
    cd "${BACKUP_DIR}"
    ls -t | tail -n +6 | xargs -r rm -rf
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

# Check if container is running and stop it gracefully
if docker ps -q -f name="${CONTAINER_NAME}" | grep -q .; then
    echo "🛑 Stopping existing container..."
    docker-compose down --timeout 30
fi

# Build and start the new container
echo "🏗️ Building and starting container..."
docker-compose up -d --build

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 10

# Health check
echo "🔍 Running health check..."
HEALTH_CHECK_URL="http://localhost:18475"
MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    if curl -f -s "$HEALTH_CHECK_URL" > /dev/null; then
        echo "✅ Health check passed! Application is running."
        break
    fi
    
    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
        echo "❌ Health check failed after $MAX_ATTEMPTS attempts"
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
    
    echo "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS failed, retrying in 5 seconds..."
    sleep 5
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