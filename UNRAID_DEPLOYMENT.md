# Unraid Deployment Guide

This document provides setup instructions for deploying the personal website on your Unraid server using GitHub-hosted CI/CD.

## 🚀 Overview

This setup uses GitHub-hosted runners for CI/CD, building and pushing Docker images to GitHub Container Registry. You can then deploy the pre-built containers on your Unraid server without needing self-hosted runners.

## 📦 Deployment Options

### Option 1: Unraid Community Applications Template (Recommended)

1. **Install Community Applications plugin** (if not already installed)
2. **Search for "personal-website"** in Community Applications
3. **Click Install** and configure the settings:
   - **Web Port**: `18475` (maps to container port 8080)

### Option 2: Manual Docker Installation

#### Using Docker Command:
```bash
# Option 1: If package is public
docker run -d \
  --name personal-website \
  --restart unless-stopped \
  -p 18475:8080 \
  ghcr.io/zachyzissou/personal-website:latest

# Option 2: If package is private (requires authentication)
echo $GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin
docker run -d \
  --name personal-website \
  --restart unless-stopped \
  -p 18475:8080 \
  ghcr.io/zachyzissou/personal-website:latest
```

#### Using Docker Compose:
```yaml
version: '3.8'

services:
  personal-website:
    image: ghcr.io/zachyzissou/personal-website:latest
    container_name: personal-website
    restart: unless-stopped
    ports:
      - "18475:8080"    # Web interface (nginx listens on 8080)
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Option 3: Unraid XML Template

1. **Download the template**: Copy `unraid-template.xml` from this repository
2. **Add to Unraid**: 
   - Go to Docker tab in Unraid
   - Click "Add Container"
   - Select "Template" and load the XML file
3. **Configure**: Adjust ports and paths as needed
4. **Apply**: Start the container

## 🔧 Configuration

### Port Mapping
- **Port 18475**: Main website access (maps to container port 8080)

### Volume Mapping (Optional)
- **Application Data**: `/mnt/user/appdata/personal-website` → `/usr/share/nginx/html`
  - Use this if you want to customize website files manually

## 🔄 Automatic Updates

The GitHub Actions workflow automatically:
1. **Builds** the website on every push to main branch
2. **Pushes** new Docker images to GitHub Container Registry
3. **Tags** images with `latest` and commit SHA

To update your deployment:
```bash
# Pull latest image
docker pull ghcr.io/zachyzissou/personal-website:latest

# Restart container with new image
docker stop personal-website
docker rm personal-website
docker run -d \
  --name personal-website \
  --restart unless-stopped \
  -p 18475:8080 \
  ghcr.io/zachyzissou/personal-website:latest
```

Or with Docker Compose:
```bash
docker-compose pull
docker-compose up -d
```

## 📊 Monitoring

### Health Checks
The container includes built-in health monitoring:
- **Internal**: `http://localhost:8080/health`
- **External**: `http://your-unraid-ip:18475/health`

### Container Status
```bash
# Check container status
docker ps | grep personal-website

# View logs
docker logs personal-website

# Check health
docker inspect personal-website --format='{{.State.Health.Status}}'
```

### Website Access
- **Local**: `http://your-unraid-ip:18475`
- **Public**: Configure reverse proxy (Nginx Proxy Manager, etc.)

## 🛡️ Security

### Container Security
- ✅ Runs as non-root user (nginx user)
- ✅ Read-only filesystem for static content
- ✅ No privileged access required
- ✅ Isolated container environment

### Network Security
- Configure reverse proxy with SSL/TLS
- Use firewall rules to restrict access
- Consider VPN access for administration

## 🔧 Customization

### Environment Variables
The container supports standard nginx environment variables:
```bash
docker run -d \
  --name personal-website \
  -e TZ=America/New_York \
  -p 18475:8080 \
  ghcr.io/zachyzissou/personal-website:latest
```

### Custom Content
If you mount a volume to `/usr/share/nginx/html`, you can:
- Override specific files
- Add custom content
- Modify the website

## 🚨 Troubleshooting

### Container Won't Start - "Unauthorized" Error

If you get an "unauthorized" error when pulling the image:

```
docker: Error response from daemon: Head "https://ghcr.io/v2/zachyzissou/personal-website/manifests/latest": unauthorized.
```

**This happens because the GitHub Container Registry package is private by default.**

#### Solution 1: Make Package Public (Recommended)
1. Go to [GitHub Packages](https://github.com/zachyzissou/personal-website/pkgs/container/personal-website)
2. Click on "Package settings"  
3. Scroll to "Danger Zone" → "Change visibility"
4. Select "Public" and confirm

Or use GitHub CLI: `gh api --method PATCH /user/packages/container/personal-website --field visibility=public`

#### Solution 2: Use Authentication
If the package must remain private, authenticate with GitHub:

```bash
# Login to GitHub Container Registry
echo $GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin

# Then pull the image
docker pull ghcr.io/zachyzissou/personal-website:latest
```

You'll need a [Personal Access Token](https://github.com/settings/tokens) with `read:packages` permission.

### Container Won't Start
```bash
# Check logs
docker logs personal-website

# Check image
docker images | grep personal-website

# Verify port availability
netstat -tulpn | grep 18475
```

### Website Not Accessible
```bash
# Test internal health
docker exec personal-website curl -f http://localhost:8080/health

# Check nginx status
docker exec personal-website nginx -t
docker exec personal-website ps aux | grep nginx
```

### Update Issues
```bash
# Force pull latest image
docker pull ghcr.io/zachyzissou/personal-website:latest --no-cache

# Clean up old images
docker image prune -f
```

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs at: https://github.com/zachyzissou/personal-website/actions
3. Check container logs with `docker logs personal-website`
4. Open an issue in the GitHub repository

## 🔄 Migration from Self-Hosted Runner

If you're migrating from the previous self-hosted runner setup:

1. **Stop the old runner**:
   ```bash
   docker stop Docker-Github-Actions-Runner-personal-website
   docker rm Docker-Github-Actions-Runner-personal-website
   ```

2. **Clean up old deployment**:
   ```bash
   cd /mnt/user/appdata/personal-website
   docker-compose down
   ```

3. **Deploy using new method** (choose option above)

4. **Update reverse proxy** configuration if needed

5. **Remove runner data** (optional):
   ```bash
   rm -rf /mnt/user/appdata/github_runner-personal-website
   ```

The new setup is simpler and doesn't require maintaining a self-hosted runner!