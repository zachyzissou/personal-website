import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  details: string;
  screenshot: string; // Path to screenshot image
  icon?: string; // Service icon URL or emoji
}

const tools: Tool[] = [
  {
    id: 'plex',
    name: 'Plex',
    category: 'Media Server',
    description: 'Personal media streaming powerhouse serving 4K content across multiple devices with transcoding magic.',
    details: 'Plex transforms my homelab into a Netflix-like experience, streaming my entire media collection with intelligent transcoding, remote access, and beautiful metadata management. Handles everything from 4K movies to music libraries with enterprise-grade reliability.',
    screenshot: '/screenshots/plex.png',
    icon: '/screenshots/plex-icon.png'
  },
  {
    id: 'ollama',
    name: 'Ollama',
    category: 'AI Runtime',
    description: 'Local large language model runtime powering private AI conversations without cloud dependencies.',
    details: 'Ollama serves as the backbone for my local AI infrastructure, running models like Llama 3.1, Mistral, and specialized coding models. Provides enterprise-grade AI capabilities while maintaining complete data privacy and control.',
    screenshot: '/screenshots/ollama.png?v=2',
    icon: '/screenshots/ollama-icon.png'
  },
  {
    id: 'open-webui',
    name: 'Open WebUI',
    category: 'AI Interface',
    description: 'Sleek web interface for local LLMs, providing ChatGPT-style conversations with self-hosted models.',
    details: 'Open WebUI creates a beautiful, responsive chat interface for interacting with local AI models. Features conversation history, model switching, and customizable personas - all running privately in my homelab.',
    screenshot: '/screenshots/open-webui.gif',
    icon: '/screenshots/open-webui-icon.png'
  },
  {
    id: 'n8n',
    name: 'n8n',
    category: 'Automation',
    description: 'Visual workflow automation platform orchestrating complex multi-step processes across services.',
    details: 'n8n is the neural network of my homelab, connecting 50+ containers with intelligent workflows. Handles everything from automated media processing and health monitoring to content aggregation and cross-service orchestration - the invisible hand that makes complex systems look effortless.',
    screenshot: '/screenshots/n8n.png',
    icon: '/screenshots/n8n-icon.png'
  },
  {
    id: 'home-assistant',
    name: 'Home Assistant',
    category: 'Smart Home',
    description: 'Central hub controlling smart home devices with advanced automation and beautiful dashboards.',
    details: 'Home Assistant orchestrates my smart home ecosystem, managing lights, sensors, and IoT devices with sophisticated automation rules. Provides stunning dashboards and integrates seamlessly with the broader homelab infrastructure.',
    screenshot: '/screenshots/homeassistant.png',
    icon: '/screenshots/home-assistant-icon.png'
  },
  {
    id: 'sonarr',
    name: 'Sonarr',
    category: 'Media Automation',
    description: 'Automated TV show management handling downloads, organization, and quality upgrades.',
    details: 'Sonarr automatically monitors for new episodes of my favorite shows, downloads them via torrents/usenet, and organizes them perfectly for Plex. Handles quality profiles, release monitoring, and seamless integration with the entire media stack.',
    screenshot: '/screenshots/sonarr.png',
    icon: '/screenshots/sonarr-icon.png'
  },
  {
    id: 'nginx-proxy-manager',
    name: 'Nginx Proxy Manager',
    category: 'Reverse Proxy',
    description: 'Web-based nginx proxy manager handling SSL certificates and routing for all services.',
    details: 'NPM is the gateway to my homelab, managing reverse proxy rules, SSL certificates, and access control. Provides secure external access to services while maintaining internal network segmentation.',
    screenshot: '/screenshots/nginx.png',
    icon: '/screenshots/nginx-proxy-manager-icon.png'
  },
  {
    id: 'tautulli',
    name: 'Tautulli',
    category: 'Media Analytics',
    description: 'Advanced Plex monitoring and statistics providing detailed insights into media consumption.',
    details: 'Tautulli tracks every aspect of my Plex server usage, from user activity to bandwidth consumption. Provides beautiful dashboards showing streaming trends, most popular content, and server performance metrics.',
    screenshot: '/screenshots/tautulli.png',
    icon: '/screenshots/tautulli-icon.png'
  },
  {
    id: 'radarr',
    name: 'Radarr',
    category: 'Media Automation',
    description: 'Automated movie management with intelligent downloading and library organization.',
    details: 'Radarr handles my entire movie collection, automatically searching for and downloading films based on quality preferences and availability. Seamlessly integrates with download clients and organizes everything for optimal Plex experience.',
    screenshot: '/screenshots/radarr.png',
    icon: '/screenshots/radarr-icon.png'
  },
  {
    id: 'unifi-controller',
    name: 'UniFi Controller',
    category: 'Network Management',
    description: 'Enterprise network management controlling VLANs, access points, and security policies.',
    details: 'The UniFi Controller manages my enterprise-grade network infrastructure, controlling multiple VLANs, WiFi access points, and security rules. Provides detailed analytics and centralized configuration for the entire network.',
    screenshot: '/screenshots/unifi.png',
    icon: '/screenshots/unifi-icon.png'
  },
  {
    id: 'pihole',
    name: 'Pi-hole',
    category: 'DNS Filtering',
    description: 'Network-wide ad blocking and DNS filtering protecting all devices from malicious content.',
    details: 'Pi-hole acts as a network-level shield, blocking ads, trackers, and malicious domains for every device on the network. Provides detailed analytics and custom filtering rules for enhanced privacy and security.',
    screenshot: '/screenshots/pihole-new.png',
    icon: '/screenshots/pihole-icon.png'
  },
  {
    id: 'overseerr',
    name: 'Overseerr',
    category: 'Media Requests',
    description: 'Elegant media request management system for Plex with user-friendly interface.',
    details: 'Overseerr provides a beautiful interface for users to request movies and TV shows, automatically integrating with Sonarr and Radarr to fulfill requests. Features user management, approval workflows, and seamless Plex integration.',
    screenshot: '/screenshots/overseer.png',
    icon: '/screenshots/overseerr-icon.png'
  }
];

const getToolIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'Media Server': '🎬',
    'AI Runtime': '🤖',
    'AI Interface': '💬',
    'Automation': '⚡',
    'Smart Home': '🏠',
    'Media Automation': '🎯',
    'Reverse Proxy': '🌐',
    'Media Analytics': '📊',
    'Git Hosting': '📚',
    'Network Management': '🔗',
    'DNS Filtering': '🛡️',
    'Media Requests': '🎭'
  };
  // eslint-disable-next-line security/detect-object-injection
  return iconMap[category] || '🔧';
};

const InteractiveTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>(tools[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);
  
  // Reset error state when tool changes
  React.useEffect(() => {
    setImageLoadError(null);
  }, [selectedTool]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="interactive-tools-container">
      <div className="tools-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
        
        {/* Left Side - Dynamic Description */}
        <motion.div 
          className="tool-description"
          key={selectedTool.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Screenshot */}
          <div 
            className="tool-screenshot"
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(6, 182, 212, 0.1))',
              border: '1px solid var(--border-color)',
              marginBottom: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Show actual screenshot if available and not errored, otherwise show placeholder */}
            {selectedTool.screenshot && imageLoadError !== selectedTool.id && (
              <img
                src={selectedTool.screenshot}
                alt={`${selectedTool.name} Interface`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  position: 'relative',
                  zIndex: 2
                }}
                onClick={openModal}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Open ${selectedTool.name} in full screen`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onError={() => {
                  console.error(`Failed to load screenshot for ${selectedTool.name}:`, selectedTool.screenshot);
                  setImageLoadError(selectedTool.id);
                }}
                onLoad={() => {
                  console.log(`Successfully loaded screenshot for ${selectedTool.name}`);
                }}
              />
            )}
            
            {/* Fallback placeholder */}
            <div 
              className="screenshot-placeholder"
              style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(45deg, rgba(168, 85, 247, 0.05), rgba(6, 182, 212, 0.05))`,
              display: (!selectedTool.screenshot || imageLoadError === selectedTool.id) ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 'var(--space-xs)'
            }}>
              <div style={{
                fontSize: 'var(--text-4xl)',
                opacity: 0.3
              }}>
                {getToolIcon(selectedTool.category)}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                textAlign: 'center'
              }}>
                {selectedTool.name} Interface
                <br />
                <span style={{ fontSize: 'var(--text-xs)' }}>Screenshot placeholder</span>
              </div>
            </div>
          </div>

          {/* Tool Info */}
          <div>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <span 
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--accent-primary)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {selectedTool.category}
              </span>
            </div>
            
            <h4 
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)'
              }}
            >
              {selectedTool.icon && (
                <img
                  src={selectedTool.icon}
                  alt={`${selectedTool.name} icon`}
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain',
                    filter: selectedTool.id === 'ollama' ? 'invert(1) brightness(2)' : 'none'
                  }}
                />
              )}
              {selectedTool.name}
            </h4>
            
            <p 
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
                marginBottom: 'var(--space-md)'
              }}
            >
              {selectedTool.description}
            </p>
            
            <p 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                lineHeight: '1.6'
              }}
            >
              {selectedTool.details}
            </p>
          </div>
        </motion.div>

        {/* Right Side - Tool Grid */}
        <div>
          <h3 style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: '600', 
            marginBottom: 'var(--space-md)', 
            color: 'var(--text-primary)' 
          }}>
            Arsenal of Digital Sorcery
          </h3>
          
          <div 
            className="tools-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-sm)',
              alignItems: 'stretch'
            }}
          >
            {tools.map((tool) => (
              <motion.button
                key={tool.id}
                className={`tool-tag ${selectedTool.id === tool.id ? 'tool-tag-active' : ''}`}
                onClick={() => setSelectedTool(tool)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: selectedTool.id === tool.id ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  border: `1px solid ${selectedTool.id === tool.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  color: selectedTool.id === tool.id ? 'white' : 'var(--text-primary)',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 'var(--space-xs)',
                  minHeight: '64px',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)'
                }}
              >
                {tool.icon && (
                  <img
                    src={tool.icon}
                    alt={`${tool.name} icon`}
                    style={{
                      width: '24px',
                      height: '24px',
                      objectFit: 'contain',
                      filter: tool.id === 'ollama' ? 'invert(1) brightness(2)' : 'none'
                    }}
                  />
                )}
                {tool.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Add responsive styles to head */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .interactive-tools-container .tools-layout {
              grid-template-columns: 1fr !important;
              gap: var(--space-lg) !important;
            }
            
            .interactive-tools-container .tools-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          
          @media (max-width: 480px) {
            .interactive-tools-container .tools-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `
      }} />

      {/* Screenshot Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTool.screenshot && imageLoadError !== selectedTool.id && (
          <motion.div
            className="screenshot-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000000,
              padding: '2rem',
              cursor: 'pointer'
            }}
          >
            <motion.div
              className="screenshot-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                cursor: 'default'
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '1rem'
              }}>
                <h3 style={{
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: '600',
                  margin: 0
                }}>
                  {selectedTool.name} Interface
                </h3>
                <button
                  onClick={closeModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal Image */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <img
                  src={selectedTool.screenshot}
                  alt={`${selectedTool.name} Interface - Full Size`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)'
                  }}
                />
              </div>

              {/* Modal Footer */}
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: 'var(--text-sm)',
                  margin: 0
                }}>
                  Click outside to close • ESC to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveTools;