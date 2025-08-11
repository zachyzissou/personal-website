# Deployment Migration: Self-Hosted to GitHub-Hosted Runners

## Overview

The CI/CD workflows have been migrated from self-hosted runners to GitHub-hosted
runners for improved reliability, security, and maintainability. This document
outlines the changes made and deployment options.

## Changes Made

### 1. Workflow Runner Migration

**Before:**

```yaml
runs-on: [self-hosted, LinuxX64, personal-website]
```

**After:**

```yaml
runs-on: ubuntu-latest
```

### 2. Updated Workflows

- ✅ **`ci.yml`** - Already using GitHub-hosted runners (no changes needed)
- ✅ **`deploy.yml`** - Migrated to GitHub-hosted runners + GitHub Pages
  deployment
- ✅ **`docker-deploy.yml`** - Migrated to GitHub-hosted runners (local
  deployment disabled)

## Deployment Options

### Option 1: GitHub Pages (Recommended)

- **Status**: ✅ Active and configured
- **URL**: `https://zachyzissou.github.io/personal-website`
- **Custom Domain**: Can be configured to `https://zachgonser.com`
- **Triggers**: Automatic deployment on push to `main` branch
- **Benefits**: Free, fast, reliable, built-in SSL

### Option 2: Docker Container Registry

- **Status**: ✅ Images built and pushed automatically
- **Registry**: `ghcr.io/zachyzissou/personal-website`
- **Use Case**: Can be deployed to any Docker-compatible hosting service
- **Benefits**: Containerized, portable, can run anywhere

### Option 3: Local Unraid Deployment (Disabled)

- **Status**: ⚠️ Disabled due to GitHub-hosted runner limitations
- **Reason**: GitHub-hosted runners cannot access local infrastructure
- **Alternative**: Could be re-enabled using self-hosted runner or webhook
  approach

## Configuration Steps

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select branch: `gh-pages` (created automatically by workflow)
4. Optional: Configure custom domain in Pages settings

### Custom Domain (Optional)

1. Add `CNAME` file to repository root with domain name
2. Configure DNS A/CNAME records to point to GitHub Pages
3. Enable "Enforce HTTPS" in repository settings

## Workflow Behavior

### On Pull Request

- Runs CI tests (linting, type-checking, build)
- Runs Lighthouse CI performance tests
- No deployment occurs

### On Push to Main

- Runs full CI pipeline
- Builds Docker image and pushes to registry
- Deploys static site to GitHub Pages
- Runs security audit

## Benefits of Migration

1. **No Infrastructure Dependencies**: No need to maintain self-hosted runners
2. **Better Security**: GitHub-managed runner environment with regular updates
3. **Improved Reliability**: GitHub's infrastructure reliability and uptime
4. **Cost Effective**: No additional hosting costs for static site
5. **Faster Builds**: GitHub's runners are well-provisioned and fast
6. **Better Integration**: Native GitHub features and Actions marketplace

## Rollback Strategy

If needed to revert to self-hosted runners:

1. Restore self-hosted runner configuration:

   ```yaml
   runs-on: [self-hosted, LinuxX64, personal-website]
   ```

2. Re-enable Unraid deployment steps in `deploy.yml`:

   ```yaml
   - name: Deploy to production
     if: github.ref == 'refs/heads/main' && github.event_name == 'push'
     run: |
       chmod +x ./scripts/deploy.sh
       ./scripts/deploy.sh
   ```

3. Ensure self-hosted runner is properly configured and running

## Monitoring and Maintenance

- **Performance**: Lighthouse CI runs automatically on PRs
- **Security**: Dependabot handles dependency updates
- **Uptime**: GitHub Pages provides 99.9% uptime SLA
- **Logs**: All workflow runs logged in Actions tab

## Next Steps

1. ✅ Configure custom domain (if desired)
2. ✅ Test deployment by pushing to main branch
3. ✅ Update any external references to new URL
4. ✅ Consider removing self-hosted runner infrastructure
