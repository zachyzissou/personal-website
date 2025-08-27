# Personal Website

[![CI](https://github.com/zachyzissou/personal-website/actions/workflows/ci.yml/badge.svg)](https://github.com/zachyzissou/personal-website/actions/workflows/ci.yml)
[![Deploy](https://github.com/zachyzissou/personal-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/zachyzissou/personal-website/actions/workflows/deploy.yml)

A modern, responsive personal portfolio built with cutting-edge technologies including Astro, React, Tailwind CSS, and Framer Motion.

## 🚀 Tech Stack

- **Astro 5** - Ultra-fast static site generator with islands architecture
- **React 19** - Interactive components with server-side rendering
- **Tailwind CSS v4** - Utility-first CSS framework with new oxide engine
- **TypeScript 5.7** - Type-safe development
- **Framer Motion** - Smooth animations and transitions
- **Docker** - Containerized deployment

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment

### 🚨 Quick Start for Unraid Users

**Getting "unauthorized" errors?** This is common! Choose one of these solutions:

#### Option 1: Build Locally (Easiest)
```bash
# Automated script for Unraid (recommended)
curl -sSL https://raw.githubusercontent.com/zachyzissou/personal-website/main/scripts/local-build-unraid.sh | bash

# Or manual steps:
git clone https://github.com/zachyzissou/personal-website.git
cd personal-website
docker build -t personal-website .
docker run -d --name personal-website -p 18475:8080 personal-website
```

#### Option 2: Make Package Public
1. Go to [Package Settings](https://github.com/zachyzissou/personal-website/pkgs/container/personal-website)
2. Change visibility to "Public"
3. Then run: `docker pull ghcr.io/zachyzissou/personal-website:latest`

#### Option 3: Use Authentication
```bash
echo $GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin
docker pull ghcr.io/zachyzissou/personal-website:latest
```

### Pre-built Images (When Public)

Images are automatically built and published to GitHub Container Registry:

```bash
# Pull and run latest image  
docker run -d \
  --name personal-website \
  --restart unless-stopped \
  -p 18475:8080 \
  ghcr.io/zachyzissou/personal-website:latest
```

### Using Docker Compose

```bash
# Use the provided docker-compose.yml
docker-compose up -d

# Or with manual pull
docker-compose pull
docker-compose up -d
```

### Building Locally

```bash
# Build the Docker image locally
docker build -t personal-website .

# Run locally built image
docker run -p 18475:80 personal-website
```

### Unraid Deployment

See `UNRAID_DEPLOYMENT.md` for comprehensive Unraid deployment guide including:
- XML template installation
- Manual Docker deployment

## 🚨 Troubleshooting

### "Unauthorized" Error When Pulling Docker Image

If you encounter:
```
docker: Error response from daemon: Head "https://ghcr.io/v2/zachyzissou/personal-website/manifests/latest": unauthorized.
```

**This happens because GitHub Container Registry packages from private repositories are private by default.**

#### Quick Fix Options:

1. **Make Package Public** (Easiest):
   - Go to [Package Settings](https://github.com/zachyzissou/personal-website/pkgs/container/personal-website)
   - Change visibility to "Public"

2. **Use Authentication**:
   ```bash
   echo $GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin
   docker pull ghcr.io/zachyzissou/personal-website:latest
   ```

3. **Build Locally** (Recommended):
   ```bash
   # Automated script for Unraid
   curl -sSL https://raw.githubusercontent.com/zachyzissou/personal-website/main/scripts/local-build-unraid.sh | bash
   
   # Or manual steps
   git clone https://github.com/zachyzissou/personal-website.git
   cd personal-website
   docker build -t personal-website .
   docker run -d --name personal-website -p 18475:8080 personal-website
   ```

For detailed troubleshooting, see `UNRAID_DEPLOYMENT.md`.
- Automatic updates
- Troubleshooting

## 🌐 Reverse Proxy Setup

### Option 1: Traefik (Recommended)

The `docker-compose.yml` includes Traefik labels for automatic HTTPS and routing:

1. Ensure Traefik is running on your Unraid server
2. Update the domain in `docker-compose.yml`
3. Deploy with `docker-compose up -d`

### Option 2: Nginx Proxy Manager

1. Comment out Traefik labels in `docker-compose.yml`
2. Use the alternative service configuration
3. Configure routing in Nginx Proxy Manager UI

### Option 3: Manual Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:18475;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📝 Customization

### Personal Information

Update the following files with your information:

- `src/components/Hero.astro` - Name and title
- `src/components/About.astro` - Professional background and skills
- `src/components/Projects.astro` - Project showcase
- `src/components/Contact.astro` - Contact information

### Styling

- Colors and themes: `tailwind.config.js`
- Global styles: `src/styles/global.css`
- Component-specific styles: Within each `.astro` file

## 📱 Features

- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Modern dark color scheme
- **Smooth Animations** - Framer Motion powered transitions
- **Interactive Components** - React islands for interactivity
- **SEO Optimized** - Meta tags and structured data
- **Performance Focused** - Lighthouse score optimized
- **Docker Ready** - Production-ready containerization

## 🔒 Security

- Content Security Policy headers
- XSS protection
- Frame options security
- Non-root container user
- Health checks included

## 📊 Performance

- Static site generation for fast loading
- Image optimization
- Gzip compression
- Browser caching strategies
- Minimal JavaScript bundle

## 🚀 Deployment Tips

1. **Update domains** in `docker-compose.yml` and nginx config
2. **Set environment variables** for production
3. **Configure SSL certificates** through your reverse proxy
4. **Monitor logs** with `docker logs personal-website`
5. **Update regularly** with `docker-compose pull && docker-compose up -d`

## 🤖 CI/CD & Deployment

This repository uses GitHub Actions with GitHub-hosted runners for automated building and deployment:

### Workflows

1. **`deploy.yml`** - Production deployment: builds and pushes Docker images to GitHub Container Registry
2. **`ci.yml`** - Continuous integration for PRs and feature branches  
3. **`docker-deploy.yml`** - Enhanced Docker build and push with multi-platform support

### Deployment Process

**Automatic:**
- Push to `main` branch triggers production build
- Docker images are built and pushed to GitHub Container Registry (`ghcr.io/zachyzissou/personal-website`)
- Pull requests trigger CI checks and preview builds

**Manual Deployment on Unraid:**
- Use the provided Unraid XML template for easy installation
- Or manually deploy using Docker Compose
- Images are automatically updated via GitHub Actions

### Unraid Setup

**Quick Start:**
1. **Use Unraid Template**: Add the provided `unraid-template.xml` to your Unraid Docker templates
2. **Configure Ports**: Main site on port 18475, health checks on 18476
3. **Deploy**: Container will automatically pull the latest image from GitHub Container Registry

**Manual Setup:**
```bash
docker run -d \
  --name personal-website \
  --restart unless-stopped \
  -p 18475:8080 \
  ghcr.io/zachyzissou/personal-website:latest
```

See `UNRAID_DEPLOYMENT.md` for comprehensive Unraid deployment guide including:

### Health Checks

- Automated health checks verify container status
- Built-in health endpoint at `/health`
- Container health monitoring included

## 📊 Monitoring

- GitHub Actions provide deployment status
- Docker health checks ensure service availability
- Logs available via `docker logs` command

## 📄 License

MIT License - feel free to use this template for your own portfolio!