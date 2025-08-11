import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  // Performance optimizations
  build: {
    // Inline critical CSS and assets
    inlineStylesheets: 'auto',
    assets: '_astro'
  },
  // Output settings for static site
  output: 'static',
  // Enable site URL for sitemap/SEO
  site: 'https://zachgonser.com',
  // Compress output
  compressHTML: true
});