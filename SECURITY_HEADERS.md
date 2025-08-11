# Security Headers & Cloudflare Configuration

This document outlines the recommended security headers and Cloudflare configuration for optimal security and performance.

## Cloudflare Security Headers

Add these headers via Cloudflare Workers or Rules:

```javascript
// Security Headers for Cloudflare Worker
const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block'
};
```

## Cloudflare Configuration Recommendations

### SSL/TLS Settings
- **SSL/TLS encryption mode**: Full (strict)
- **Minimum TLS Version**: 1.2
- **Opportunistic Encryption**: Enabled
- **TLS 1.3**: Enabled
- **Automatic HTTPS Rewrites**: Enabled
- **Certificate Transparency Monitoring**: Enabled

### Speed Optimizations
- **Auto Minify**: HTML, CSS, JS all enabled
- **Brotli Compression**: Enabled
- **Rocket Loader**: Enabled (test compatibility)
- **Mirage**: Enabled for image optimization
- **Polish**: Lossless compression

### Caching Rules
```javascript
// Example Cache Rules
{
  "*.css": "1 month",
  "*.js": "1 month", 
  "*.woff2": "1 year",
  "*.svg": "1 month",
  "*.png": "1 month",
  "*.jpg": "1 month",
  "*.webp": "1 month",
  "/": "4 hours"
}
```

### Page Rules
1. **www.zachgonser.com*** → Forwarding URL (301) → `https://zachgonser.com/$1`
2. **zachgonser.com/*** → Cache Level: Standard, Browser TTL: 4 hours

### Security
- **Security Level**: Medium
- **Challenge Passage**: 30 minutes  
- **Browser Integrity Check**: Enabled
- **Privacy Pass**: Enabled
- **Email Obfuscation**: Enabled
- **Server-side Excludes**: Enabled
- **Hotlink Protection**: Enabled

### Network
- **HTTP/3 (with QUIC)**: Enabled
- **0-RTT Connection Resumption**: Enabled
- **gRPC**: Enabled
- **WebSockets**: Enabled
- **IP Geolocation**: Enabled
- **Maximum Upload Size**: 100 MB

### DNS
- **DNSSEC**: Enabled
- **CNAME Flattening**: Flatten at root
- **Proxy Status**: Proxied (orange cloud) for main domain
- **TTL**: Auto

## HSTS Preload

To add the domain to HSTS preload list:
1. Visit https://hstspreload.org/
2. Enter `zachgonser.com`
3. Ensure all requirements are met:
   - Valid certificate
   - Redirect from HTTP to HTTPS
   - All subdomains served over HTTPS
   - HSTS header on base domain with:
     - `max-age` at least 31536000 seconds (1 year)
     - `includeSubDomains` directive
     - `preload` directive

## Testing Security Headers

Use these tools to verify configuration:
- [Security Headers](https://securityheaders.com/)
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [webhint](https://webhint.io/)

## GitHub Pages Configuration

Since we're using GitHub Pages behind Cloudflare:

1. **Custom Domain**: Set to `zachgonser.com` in GitHub repo settings
2. **HTTPS**: Enabled (handled by Cloudflare)
3. **CNAME Record**: Point to `zachyzissou.github.io`
4. **A Records**: Not needed when using Cloudflare proxy

## Environment Variables (if needed)

For any dynamic features, use GitHub Secrets:
```bash
CLOUDFLARE_API_TOKEN=<token>
CLOUDFLARE_ZONE_ID=<zone_id>
```