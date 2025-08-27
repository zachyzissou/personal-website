#!/bin/bash

# Local Build Script for Unraid
# This script helps Unraid users build the personal website locally
# to avoid GitHub Container Registry authentication issues

set -e

echo "🚀 Personal Website - Local Build for Unraid"
echo "=============================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="personal-website"
LOCAL_IMAGE_NAME="personal-website"
WEB_PORT="18475"
CONTAINER_PORT="8080"

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

print_success "Docker is available"

# Check if git is available
if ! command -v git &> /dev/null; then
    print_error "Git is not installed or not in PATH"
    exit 1
fi

print_success "Git is available"

# Stop and remove existing container if it exists
print_status "Checking for existing container..."
if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    print_warning "Existing container found. Stopping and removing..."
    docker stop "${CONTAINER_NAME}" || true
    docker rm "${CONTAINER_NAME}" || true
    print_success "Old container removed"
fi

# Remove existing local image if it exists
print_status "Checking for existing local image..."
if docker images --format "table {{.Repository}}" | grep -q "^${LOCAL_IMAGE_NAME}$"; then
    print_warning "Existing local image found. Removing..."
    docker rmi "${LOCAL_IMAGE_NAME}" || true
    print_success "Old image removed"
fi

# Clone or update repository
REPO_DIR="/tmp/personal-website-build"
if [ -d "$REPO_DIR" ]; then
    print_status "Repository directory exists. Updating..."
    cd "$REPO_DIR"
    git pull origin main
else
    print_status "Cloning repository..."
    git clone https://github.com/zachyzissou/personal-website.git "$REPO_DIR"
    cd "$REPO_DIR"
fi

print_success "Repository ready"

# Build Docker image
print_status "Building Docker image (this may take a few minutes)..."
if docker build -t "${LOCAL_IMAGE_NAME}" .; then
    print_success "Docker image built successfully"
else
    print_error "Docker build failed"
    exit 1
fi

# Run container
print_status "Starting container..."
docker run -d \
    --name "${CONTAINER_NAME}" \
    --restart unless-stopped \
    -p "${WEB_PORT}:${CONTAINER_PORT}" \
    "${LOCAL_IMAGE_NAME}"

# Wait a moment for container to start
sleep 5

# Check if container is running
if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    print_success "Container is running successfully!"
    echo ""
    echo "🌐 Your personal website is now available at:"
    echo "   http://$(ip route get 1 | awk '{print $7; exit}'):${WEB_PORT}"
    echo "   http://localhost:${WEB_PORT} (if accessing from the Unraid server directly)"
    echo ""
    echo "📋 Container Management Commands:"
    echo "   View logs:    docker logs ${CONTAINER_NAME}"
    echo "   Stop:         docker stop ${CONTAINER_NAME}"
    echo "   Start:        docker start ${CONTAINER_NAME}"
    echo "   Remove:       docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}"
    echo ""
    echo "🔄 To update to latest code:"
    echo "   Run this script again - it will rebuild everything"
    echo ""
else
    print_error "Container failed to start"
    print_status "Checking container logs..."
    docker logs "${CONTAINER_NAME}" || true
    exit 1
fi

# Cleanup temporary files
if [ -z "$PRESERVE_BUILD" ]; then
    print_status "Cleaning up build directory..."
    rm -rf "$REPO_DIR"
    print_success "Cleanup complete"
else
    print_status "Preserving build directory for troubleshooting (set PRESERVE_BUILD= to disable)"
fi

echo ""
echo "🎉 Setup complete! Your personal website is ready."