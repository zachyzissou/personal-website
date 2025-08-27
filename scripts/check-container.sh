#!/bin/bash

# Personal Website Container Diagnostics Script
# Comprehensive diagnostics for the personal website container on Unraid

echo "🔍 Personal Website Container Diagnostics"
echo "========================================"
echo ""

# Check if we're on a deployment target or general Unraid system
DEPLOY_TARGET_MODE=false
if [ -f "/deploy-target/docker-compose.yml" ]; then
    echo "✅ Running on deployment target (Unraid with CI/CD)"
    cd /deploy-target
    DEPLOY_TARGET_MODE=true
elif [ -f "/mnt/user/appdata/personal-website/docker-compose.yml" ]; then
    echo "✅ Running on Unraid with manual setup"
    cd /mnt/user/appdata/personal-website
else
    echo "ℹ️  Running general diagnostics (use on Unraid server)"
fi

echo ""
echo "1. Docker Container Status:"
echo "---------------------------"
if docker ps | grep -q personal-website; then
    echo "✅ Container 'personal-website' is running"
    docker ps | grep personal-website
else
    echo "❌ Container 'personal-website' is NOT running"
    echo ""
    echo "Checking stopped containers:"
    docker ps -a | grep personal-website || echo "No container found at all"
fi

echo ""
echo "2. Port Binding Check:"
echo "---------------------"
docker port personal-website 2>/dev/null || echo "❌ No port bindings found"

echo ""
echo "3. Docker Network Settings:"
echo "---------------------------"
echo "Network mode:"
docker inspect personal-website -f '{{.HostConfig.NetworkMode}}' 2>/dev/null || echo "❌ Cannot determine network mode"
echo ""
echo "Port mappings (detailed):"
docker inspect personal-website -f '{{json .NetworkSettings.Ports}}' 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "❌ Cannot inspect network settings"

echo ""
echo "4. Docker Compose Configuration:"
echo "-------------------------------"
if [ "$DEPLOY_TARGET_MODE" = true ] && [ -f "docker-compose.yml" ]; then
    echo "✅ Found docker-compose.yml in deployment target:"
    docker-compose config 2>/dev/null || echo "❌ Docker compose config validation failed"
elif [ -f "/mnt/user/appdata/personal-website/docker-compose.yml" ]; then
    echo "✅ Found docker-compose.yml in appdata:"
    docker-compose config 2>/dev/null || echo "❌ Docker compose config validation failed"
else
    echo "❌ No docker-compose.yml found"
fi

echo ""
echo "5. Internal Container Health:"
echo "----------------------------"
if docker ps | grep -q personal-website; then
    echo "Testing nginx inside container on port 8080:"
    docker exec personal-website curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:8080/health 2>/dev/null || echo "❌ Internal health check failed"
    echo ""
    echo "Checking nginx process:"
    docker exec personal-website ps aux | grep nginx 2>/dev/null || echo "❌ Nginx not running"
    echo ""
    echo "Testing nginx configuration:"
    docker exec personal-website nginx -t 2>/dev/null || echo "❌ Nginx config test failed"
else
    echo "❌ Container not running - cannot test internal health"
fi

echo ""
echo "6. Host Port and Network Check:"
echo "------------------------------"
echo "Checking what's listening on port 18475:"
netstat -tlnp 2>/dev/null | grep 18475 || ss -tlnp 2>/dev/null | grep 18475 || echo "❌ Nothing listening on port 18475"

echo ""
echo "7. Container Logs (last 20 lines):"
echo "---------------------------------"
if docker ps -a | grep -q personal-website; then
    docker logs personal-website --tail 20 2>&1
else
    echo "❌ No container to get logs from"
fi

echo ""
echo "8. Docker Compose Status:"
echo "------------------------"
if command -v docker-compose >/dev/null 2>&1; then
    docker-compose ps 2>/dev/null || echo "❌ Docker Compose not available or no services"
else
    echo "❌ Docker Compose not installed"
fi

echo ""
echo "9. Firewall Check:"
echo "-----------------"
if command -v iptables >/dev/null 2>&1; then
    echo "Checking iptables rules for port 18475:"
    iptables -L -n | grep 18475 || echo "No specific iptables rules for port 18475"
else
    echo "iptables not available for firewall check"
fi

echo ""
echo "10. Quick Restart Guide:"
echo "-----------------------"
echo "To restart the container:"
if [ "$DEPLOY_TARGET_MODE" = true ]; then
    echo "  cd /deploy-target"
else
    echo "  cd /mnt/user/appdata/personal-website"
fi
echo "  docker-compose down"
echo "  docker-compose up -d"
echo ""
echo "To force recreate:"
echo "  docker-compose down"
echo "  docker-compose up -d --force-recreate"

echo ""
echo "========================================"
echo "📋 Diagnostic Summary"
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
echo "- Health check failing: Check nginx configuration and logs"