#!/bin/bash

# Run this script on your Unraid server to diagnose the container issue

echo "🔍 Diagnosing Personal Website Container on Unraid"
echo "================================================="
echo ""

# Check if container is running
echo "1. Container Status:"
echo "-------------------"
if docker ps | grep -q personal-website; then
    echo "✅ Container is running"
    docker ps | grep personal-website
else
    echo "❌ Container is NOT running"
    echo ""
    echo "Checking stopped containers:"
    docker ps -a | grep personal-website || echo "No container found"
fi

echo ""
echo "2. Port Binding Check:"
echo "---------------------"
docker port personal-website 2>/dev/null || echo "❌ No port bindings found"

echo ""
echo "3. Docker Inspect (Network Settings):"
echo "------------------------------------"
docker inspect personal-website -f '{{json .NetworkSettings.Ports}}' 2>/dev/null | python3 -m json.tool || echo "❌ Cannot inspect container"

echo ""
echo "4. Docker Compose Configuration:"
echo "-------------------------------"
if [ -f /deploy-target/docker-compose.yml ]; then
    echo "Found docker-compose.yml in /deploy-target:"
    cat /deploy-target/docker-compose.yml
else
    echo "❌ No docker-compose.yml found in /deploy-target"
fi

echo ""
echo "5. Container Logs (last 30 lines):"
echo "---------------------------------"
docker logs personal-website --tail 30 2>&1 || echo "❌ Cannot get logs"

echo ""
echo "6. Host Port Check:"
echo "------------------"
echo "Checking what's listening on port 18475:"
netstat -tlnp 2>/dev/null | grep 18475 || ss -tlnp 2>/dev/null | grep 18475 || echo "❌ Nothing listening on port 18475"

echo ""
echo "7. Docker Network Mode:"
echo "----------------------"
docker inspect personal-website -f '{{.HostConfig.NetworkMode}}' 2>/dev/null || echo "❌ Cannot determine network mode"

echo ""
echo "8. Try to restart the container:"
echo "-------------------------------"
echo "Run these commands to restart:"
echo "  cd /deploy-target"
echo "  docker-compose down"
echo "  docker-compose up -d"
echo ""
echo "Or force recreate:"
echo "  cd /deploy-target"
echo "  docker-compose down"
echo "  docker-compose up -d --force-recreate"