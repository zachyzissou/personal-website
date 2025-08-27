# Docker Authorization Issues - Quick Reference

If you're seeing this error:
```
docker: Error response from daemon: Head "https://ghcr.io/v2/zachyzissou/personal-website/manifests/latest": unauthorized.
```

## 🚀 Quick Solutions (Pick One)

### Option 1: Build Locally (Recommended)
```bash
# One command solution - run this on your Unraid server
curl -sSL https://raw.githubusercontent.com/zachyzissou/personal-website/main/scripts/local-build-unraid.sh | bash
```

### Option 2: Make Package Public
1. Go to https://github.com/zachyzissou/personal-website/pkgs/container/personal-website
2. Click "Package settings" → "Change visibility" → "Public"

### Option 3: Use Authentication
```bash
echo $GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin
docker pull ghcr.io/zachyzissou/personal-website:latest
```

## Why This Happens
- GitHub Container Registry packages from private repos are private by default
- Building locally bypasses this completely - no authentication needed
- You don't need any special setup on Unraid to build locally

## More Details
- See [README.md](README.md) for full Docker deployment guide
- See [UNRAID_DEPLOYMENT.md](UNRAID_DEPLOYMENT.md) for comprehensive Unraid setup guide