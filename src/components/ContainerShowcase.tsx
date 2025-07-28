import { useState } from 'react';
import { motion } from 'framer-motion';

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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
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
        <h3 className="text-3xl font-bold text-white mb-4">
          The Container Fleet
        </h3>
        <p className="text-slate-300 max-w-3xl mx-auto">
          50+ specialized containers working in harmony to power the digital empire. 
          Each service carefully orchestrated for maximum efficiency and minimal maintenance.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            className="bg-slate-800/50 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-800/70 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div 
              className="category-header cursor-pointer"
              onClick={() => toggleCategory(category.id)}
            >
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
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      {category.containers.length} containers
                    </span>
                    <motion.div
                      animate={{ rotate: expandedCategories.has(category.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{
                height: expandedCategories.has(category.id) ? 'auto' : 0,
                opacity: expandedCategories.has(category.id) ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 mt-4 border-t border-slate-700/50">
                {category.containers.map((container, index) => (
                  <motion.div
                    key={container.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="p-2 rounded-lg transition-colors hover:bg-slate-700/30"
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
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

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