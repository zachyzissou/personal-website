import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface Container {
  name: string;
  purpose: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  containers: Container[];
  icon: string;
  gradient: string;
}

const categories: Category[] = [
  {
    id: 'media-downloads',
    title: 'Media & Downloads',
    description: 'Streaming, library management, torrent/NZB downloads and request automation',
    icon: 'fa-film',
    gradient: 'from-red-500 to-pink-500',
    containers: [
      { name: 'Plex', purpose: 'Media server for streaming personal content' },
      { name: 'Jellyfin', purpose: 'Open-source alternative media server' },
      { name: 'Sonarr', purpose: 'TV show automated download management' },
      { name: 'Radarr', purpose: 'Movie automated download management' },
      { name: 'Lidarr', purpose: 'Music automated download management' },
      { name: 'Readarr', purpose: 'Book and audiobook management' },
      { name: 'Prowlarr', purpose: 'Indexer manager for all *arr apps' },
      { name: 'Bazarr', purpose: 'Subtitle download automation' },
      { name: 'DelugeVPN', purpose: 'Torrent client with built-in VPN' },
      { name: 'sabnzbd', purpose: 'Usenet binary newsreader' },
      { name: 'Overseerr', purpose: 'Request management for media' },
      { name: 'Jackett', purpose: 'Torrent tracker API proxy' },
      { name: 'Tautulli', purpose: 'Plex monitoring and statistics' },
      { name: 'SpotDL-WebGUI', purpose: 'Spotify music downloader interface' },
      { name: 'YouTube-DL-Material', purpose: 'YouTube video downloader UI' },
      { name: 'MyDownloadManager', purpose: 'General download manager' }
    ]
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    description: 'Local LLMs, chat front-ends, CAPTCHA solver, workflow automation and SSO',
    icon: 'fa-robot',
    gradient: 'from-purple-500 to-indigo-500',
    containers: [
      { name: 'Ollama', purpose: 'Local large language model runtime' },
      { name: 'Open WebUI', purpose: 'Web interface for local LLMs' },
      { name: 'SillyTavern', purpose: 'Advanced AI character chat interface' },
      { name: 'FlareSolverr', purpose: 'Cloudflare CAPTCHA bypass proxy' },
      { name: 'n8n', purpose: 'Workflow automation platform' },
      { name: 'Authelia', purpose: 'Single sign-on and 2FA portal' }
    ]
  },
  {
    id: 'home-network',
    title: 'Home & Network',
    description: 'Smart-home orchestration, network management, DNS filtering, and security',
    icon: 'fa-network-wired',
    gradient: 'from-cyan-500 to-blue-500',
    containers: [
      { name: 'Home Assistant', purpose: 'Smart home automation hub' },
      { name: 'Unifi-Controller', purpose: 'Network device management' },
      { name: 'Pi-hole', purpose: 'DNS-level ad blocking' },
      { name: 'AdGuard-Home', purpose: 'Alternative DNS filtering' },
      { name: 'Cloudflared', purpose: 'Cloudflare tunnel for secure access' },
      { name: 'Nginx-Proxy-Manager', purpose: 'Reverse proxy with GUI' },
      { name: 'SWAG', purpose: 'Secure reverse proxy with auto SSL' },
      { name: 'Portainer-CE', purpose: 'Docker container management UI' },
      { name: 'Watchtower', purpose: 'Automatic container updates' },
      { name: 'DuckDNS', purpose: 'Dynamic DNS service' },
      { name: 'OpenVPN-AS', purpose: 'VPN server for remote access' },
      { name: 'Vaultwarden', purpose: 'Self-hosted password manager' },
      { name: 'Heimdall', purpose: 'Application dashboard' }
    ]
  },
  {
    id: 'productivity-devops',
    title: 'Productivity & DevOps',
    description: 'Remote IDE, git hosting, file sync, databases, and development tools',
    icon: 'fa-code',
    gradient: 'from-emerald-500 to-teal-500',
    containers: [
      { name: 'Code-Server', purpose: 'VS Code in the browser' },
      { name: 'Gitea', purpose: 'Self-hosted Git service' },
      { name: 'Nextcloud', purpose: 'File sync and collaboration' },
      { name: 'FileBrowser', purpose: 'Web-based file manager' },
      { name: 'MariaDB', purpose: 'MySQL-compatible database' },
      { name: 'Minecraft-Server', purpose: 'Private game server' },
      { name: 'Browserless', purpose: 'Headless browser automation' },
      { name: 'Dozzle', purpose: 'Real-time container log viewer' },
      { name: 'nginx', purpose: 'High-performance web server' },
      { name: 'personal-website', purpose: 'This portfolio site' },
      { name: 'FotoPress', purpose: 'Photo blog platform' }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function ContainerShowcase() {
  // All categories are always expanded now
  const expandedCategories = new Set(categories.map(cat => cat.id));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    
    if (info.offset.x > threshold || velocity > 500) {
      prevCard();
    } else if (info.offset.x < -threshold || velocity < -500) {
      nextCard();
    }
  };

  return (
    <div className="container-showcase mt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h3 
          className="mb-4"
          style={{
            fontSize: 'clamp(var(--text-4xl), 5vw, var(--text-5xl))',
            textAlign: 'center',
            textShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #a855f7, #06b6d4, #10b981, #a855f7)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 6s ease-in-out infinite',
            position: 'relative'
          }}
        >
          The Container Fleet
        </h3>
        <p className="text-slate-300 max-w-3xl mx-auto">
          50+ specialized containers working in harmony to power the digital empire. 
          Each service carefully orchestrated for maximum efficiency and minimal maintenance.
        </p>
      </motion.div>

      {/* Desktop Grid View */}
      {!isMobile && (
        <motion.div
          className="container-desktop-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(2, 1fr)'
          }}
        >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            className="bg-slate-800/50 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-800/70 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 relative isolation-auto"
            style={{ isolation: 'isolate' }}
          >
            <div className="category-header">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <i className={`fas ${category.icon} text-2xl text-white`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {category.title}
                  </h4>
                  <p className="text-slate-400 text-sm">
                    {category.description}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs text-slate-500">
                      {category.containers.length} containers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="border-t border-slate-700/50 mt-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.containers.map((container, index) => (
                    <motion.div
                      key={`${category.id}-${container.name}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.2 
                      }}
                      className="p-2 rounded-lg transition-all duration-200 hover:bg-slate-700/30"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold text-slate-200 text-sm block">{container.name}</span>
                          <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{container.purpose}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      )}

      {/* Mobile Carousel View */}
      {isMobile && (
        <div className="container-mobile-carousel" style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ gap: '0' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="flex-shrink-0"
              style={{ 
                width: '100%',
                minWidth: '100%',
                padding: '0 2rem'
              }}
              animate={{
                scale: index === currentIndex ? 1 : 0.95,
                opacity: index === currentIndex ? 1 : 0.7
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-800/70 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 relative isolation-auto h-full"
                style={{ isolation: 'isolate' }}
              >
                <div className="category-header">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <i className={`fas ${category.icon} text-2xl text-white`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">
                        {category.title}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {category.description}
                      </p>
                      <div className="mt-3">
                        <span className="text-xs text-slate-500">
                          {category.containers.length} containers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="border-t border-slate-700/50 mt-4 pt-4">
                    <div className="grid grid-cols-1 gap-3">
                      {category.containers.map((container, containerIndex) => (
                        <motion.div
                          key={`${category.id}-${container.name}-${containerIndex}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: containerIndex * 0.05,
                            duration: 0.2 
                          }}
                          className="p-2 rounded-lg transition-all duration-200 hover:bg-slate-700/30"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <span className="font-semibold text-slate-200 text-sm block">{container.name}</span>
                              <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{container.purpose}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Navigation */}
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={prevCard}
            className="p-3 rounded-full bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-500/50 transition-colors touch-manipulation"
            aria-label="Previous category"
          >
            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Pagination Dots */}
          <div className="flex gap-2.5 px-4">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 touch-manipulation ${
                  index === currentIndex 
                    ? 'bg-purple-400 w-8' 
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to category ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextCard}
            className="p-3 rounded-full bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-500/50 transition-colors touch-manipulation"
            aria-label="Next category"
          >
            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Swipe Instructions */}
        <p className="text-center text-slate-400 text-sm mt-4">
          Swipe or use arrows to navigate
        </p>
      </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-slate-500 italic">
          <i className="fas fa-shield-alt mr-2"></i>
          Sensitive services like Vaultwarden and Nextcloud are firewalled and not publicly accessible
        </p>
      </motion.div>

    </div>
  );
}