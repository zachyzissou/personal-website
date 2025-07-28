# Self-Hosted Runner Setup for Unraid

This document provides setup instructions for your GitHub Actions self-hosted runner on Unraid.

## 🏃‍♂️ Runner Configuration

Your runner is configured with these settings:
- **Container Name**: `Docker-Github-Actions-Runner-personal-website`
- **Runner Name**: `personal-website-runner`
- **Labels**: `self-hosted,LinuxX64,personal-website`
- **Scope**: Repository-specific
- **Working Directory**: `/personal-website/_work`

## 📁 Volume Mounts

| Host Path | Container Path | Purpose |
|-----------|----------------|---------|
| `/mnt/user/appdata/github_runner-personal-website/persistent_files` | `/runner/persistent_files` | Runner state persistence |
| `/mnt/user/appdata/personal-website` | `/deploy-target` | Deployment target |
| `/var/run/docker.sock` | `/var/run/docker.sock` | Docker access |
| `/tmp/runner` | `/tmp/runner` | Temporary files |

## 🔧 Initial Setup

1. **Run the setup script on your Unraid server:**
   ```bash
   # Download and run the setup script
   curl -sSL https://raw.githubusercontent.com/zachyzissou/personal-website/main/scripts/unraid-setup.sh | bash
   ```

2. **Verify runner status:**
   ```bash
   docker logs Docker-Github-Actions-Runner-personal-website
   ```

3. **Check GitHub:**
   - Go to your repository → Settings → Actions → Runners
   - Verify `personal-website-runner` shows as "Online"

## 🚀 Deployment Process

When you push to the `main` branch:

1. **GitHub Actions triggers** the workflow on your runner
2. **Code is checked out** to the runner's working directory
3. **Dependencies are installed** and the site is built
4. **Deployment script runs** copying files to `/deploy-target`
5. **Docker container is built** and deployed
6. **Health checks verify** the deployment

## 📊 Monitoring

Monitor your deployments:

```bash
# Check container status
docker ps | grep personal-website

# View application logs
docker logs personal-website

# Test website (using your unique port)
curl http://localhost:18475

# Monitor runner logs
docker logs Docker-Github-Actions-Runner-personal-website

# Check monitoring logs
tail -f /mnt/user/appdata/personal-website/logs/monitor.log
```

## 🔧 Troubleshooting

### Runner Issues

**Runner shows offline:**
```bash
# Restart the runner container
docker restart Docker-Github-Actions-Runner-personal-website
```

**Runner token expired:**
1. Go to GitHub → Settings → Actions → Runners
2. Remove the old runner
3. Generate new token and update container environment

### Deployment Issues

**Build fails:**
```bash
# Check runner logs
docker logs Docker-Github-Actions-Runner-personal-website --tail 100

# Check disk space
df -h /mnt/user/appdata/
```

**Container won't start:**
```bash
# Check deployment logs
cat /mnt/user/appdata/personal-website/logs/monitor.log

# Manually test deployment
cd /mnt/user/appdata/personal-website
docker-compose up -d
```

## 🛡️ Security

Your runner has access to:
- ✅ Docker socket (required for deployments)
- ✅ Deployment target directory
- ✅ Repository code during builds
- ❌ Host system (isolated in container)

## 🔄 Updates

**Update runner image:**
```bash
docker pull myoung34/github-runner:latest
# Recreate container with new image
```

**Update deployment scripts:**
- Scripts are pulled fresh from repository on each deployment
- No manual updates required

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs in the repository
3. Check Unraid system logs
4. Verify network connectivity and Docker daemon status