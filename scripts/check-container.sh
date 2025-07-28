#!/bin/bash

# Container Debug Script for Personal Website on Unraid
# This script helps diagnose why the container isn't accessible on port 18475

echo "🔍 Personal Website Container Diagnostics"
echo "========================================"
echo ""

# Check if we're on the Unraid server
if [ -f "/deploy-target/docker-compose.yml" ]; then
    echo "✅ Running on deployment target (Unraid)"
    cd /deploy-target
else
    echo "❌ Not on deployment target. This script should be run on your Unraid server."
    echo "   You can SSH into your Unraid server and run:"
    echo "   docker ps | grep personal-website"
    echo "   docker logs personal-website"
    exit 1
fi

echo ""
echo "1. Checking Docker container status..."
echo "-------------------------------------"
if docker ps | grep -q personal-website; then
    echo "✅ Container 'personal-website' is running"
    docker ps | grep personal-website
else
    echo "❌ Container 'personal-website' is NOT running"
    echo ""
    echo "Checking if container exists but is stopped:"
    docker ps -a | grep personal-website || echo "Container not found at all"
fi

echo ""
echo "2. Checking port bindings..."
echo "----------------------------"
docker port personal-website 2>/dev/null || echo "❌ No port mappings found"

echo ""
echo "3. Checking container network..."
echo "-------------------------------"
docker inspect personal-website --format='{{range $key, $value := .NetworkSettings.Networks}}Network: {{$key}}{{"\n"}}IP: {{$value.IPAddress}}{{"\n"}}{{end}}' 2>/dev/null || echo "❌ Could not inspect container"

echo ""
echo "4. Testing internal nginx..."
echo "---------------------------"
if docker ps | grep -q personal-website; then
    echo "Testing nginx inside container on port 8080:"
    docker exec personal-website curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health || echo "❌ Internal nginx test failed"
    echo ""
    echo "Checking nginx process:"
    docker exec personal-website ps aux | grep nginx || echo "❌ Nginx not running"
fi

echo ""
echo "5. Checking host port 18475..."
echo "------------------------------"
echo "Checking what's listening on port 18475:"
netstat -tlnp 2>/dev/null | grep 18475 || lsof -i :18475 2>/dev/null || echo "❌ Nothing listening on port 18475"

echo ""
echo "6. Recent container logs..."
echo "--------------------------"
if docker ps -a | grep -q personal-website; then
    docker logs personal-website --tail 20 2>&1
else
    echo "❌ No container to get logs from"
fi

echo ""
echo "7. Docker Compose status..."
echo "--------------------------"
docker-compose ps 2>/dev/null || echo "❌ Docker Compose not available or no services"

echo ""
echo "8. Firewall check..."
echo "-------------------"
# Check if iptables has any rules blocking 18475
if command -v iptables >/dev/null 2>&1; then
    echo "Checking iptables rules for port 18475:"
    iptables -L -n | grep 18475 || echo "No specific iptables rules for port 18475"
else
    echo "iptables not available for firewall check"
fi

echo ""
echo "========================================"
echo "Diagnostic Summary:"
echo ""
echo "To access the website from your local machine:"
echo "1. Ensure the container is running on Unraid"
echo "2. Use your Unraid server's IP address (not localhost)"
echo "3. Access: http://<UNRAID-IP>:18475"
echo ""
echo "Common issues:"
echo "- Container not running: Check deployment logs"
echo "- Port not bound: Check docker-compose.yml port mapping"
echo "- Firewall blocking: Check Unraid firewall settings"
echo "- Wrong IP: Use Unraid server IP, not localhost"