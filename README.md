# Personal Website

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

### Building the Container

```bash
# Build the Docker image
docker build -t personal-website .

# Run locally
docker run -p 3000:80 personal-website
```

### Using Docker Compose

```bash
# Start the container
docker-compose up -d

# Stop the container
docker-compose down
```

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
        proxy_pass http://localhost:3000;
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

## 📄 License

MIT License - feel free to use this template for your own portfolio!