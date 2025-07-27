import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CpuChipIcon,
  BoltIcon, 
  ServerIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  techStack: string[];
  highlights: string[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const projects: Project[] = [
  {
    id: 'ai-inference-cluster',
    title: 'AI Inference Cluster',
    description: 'Multi-GPU cluster running Stable Diffusion, local LLMs, and custom fine-tuned models. Because why pay OpenAI when you can burn electricity at home?',
    detailedDescription: 'A distributed computing powerhouse orchestrating a mix of enterprise-grade NVIDIA GPUs and consumer RTX cards across containerized environments. This neural network playground processes everything from artistic Stable Diffusion generations to complex language model inference, all while maintaining enterprise-grade reliability and scalability.',
    techStack: ['Docker Swarm', 'NVIDIA GPUs', 'PyTorch', 'Open WebUI', 'Stable Diffusion', 'CUDA', 'Ollama'],
    highlights: [
      '40+ LLMs deployed simultaneously',
      'Sub-2s image generation pipeline',
      'Custom fine-tuned models for domain-specific tasks',
      'Automated model deployment and scaling'
    ],
    icon: CpuChipIcon,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'automation-nexus',
    title: 'Automation Nexus',
    description: 'Orchestrating 50+ containers with n8n workflows, monitoring everything with Grafana, and automating the automation of automations.',
    detailedDescription: 'The central nervous system of my digital empire. This automation framework coordinates container orchestration, service monitoring, and intelligent workflow management. It\'s achieved such sophistication that it now automates its own optimization processes.',
    techStack: ['n8n', 'Docker Compose', 'Grafana', 'Prometheus', 'Home Assistant', 'Redis', 'PostgreSQL'],
    highlights: [
      '200+ automated workflows active',
      '99.97% infrastructure uptime',
      'Self-healing container recovery',
      'Predictive scaling based on usage patterns'
    ],
    icon: BoltIcon,
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'network-fortress',
    title: 'Network Fortress',
    description: 'Enterprise-grade network with Unifi gear, multiple VLANs, reverse proxy magic, and bulletproof ad blocking with Pi-hole and AdGuard.',
    detailedDescription: 'A robust network architecture that would make enterprise teams jealous. Segmented VLANs, intelligent traffic routing through Nginx Proxy Manager, and comprehensive ad blocking with Pi-hole and AdGuard create a fast, secure digital fortress while maintaining seamless user experience.',
    techStack: ['Unifi Controller', 'Nginx Proxy Manager', 'Pi-hole', 'AdGuard', 'Wireguard', 'Cloudflare Tunnel', 'Let\'s Encrypt'],
    highlights: [
      '4 isolated network segments',
      'Sub-10ms internal routing latency',
      '99%+ ad blocking effectiveness',
      'Zero-downtime reverse proxy management'
    ],
    icon: ServerIcon,
    gradient: 'from-emerald-500 to-teal-500'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const IconComponent = project.icon;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ 
        scale: 1.02,
        zIndex: 50,
        transition: { duration: 0.3 }
      }}
      className="group relative isolate w-full h-full"
      style={{ 
        isolation: 'isolate'
      }}
    >
      <div className="project-card relative rounded-2xl h-full transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 isolate overflow-hidden">
        {/* Solid Background Layer */}
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl rounded-2xl" />
        
        {/* Border Layer */}
        <div className="absolute inset-0 border border-slate-600/50 hover:border-slate-500/70 rounded-2xl transition-colors duration-500" />
        
        {/* Gradient Border Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-lg`} />
        
        {/* Content Layer */}
        <div 
          className="relative z-10 h-full flex flex-col"
          style={{ padding: 'var(--space-md)', gap: 'var(--space-md)' }}
        >
          {/* Header with Icon and Title */}
          <div className="flex items-start gap-4 flex-shrink-0">
            <div className={`w-14 h-14 bg-gradient-to-br ${project.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
              <IconComponent className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300 mb-2">
                {project.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                {project.description}
              </p>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="flex-shrink-0">
            <p className="text-slate-200 text-sm leading-relaxed">
              {project.detailedDescription}
            </p>
          </div>

          {/* Key Highlights */}
          <div className="flex-1 min-h-0">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Key Achievements
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-300">
                  <ShieldCheckIcon className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="flex-shrink-0 mt-auto">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-700/70 text-slate-200 rounded text-xs border border-slate-600/50 group-hover:border-slate-500/70 group-hover:bg-slate-600/70 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
      </div>
    </motion.div>
  );
}

export default function ProjectShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      prevCard();
    } else if (info.offset.x < -threshold) {
      nextCard();
    }
  };

  return (
    <section 
      className="section relative" 
      style={{ 
        background: 'var(--bg-projects)',
        padding: 'var(--space-4xl) var(--space-md)'
      }}
    >
      <div 
        className="relative z-10"
        style={{
          maxWidth: 'var(--max-width-content)',
          margin: '0 auto',
          padding: '0 var(--space-md)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 
            className="gradient-text"
            style={{
              fontSize: 'clamp(var(--text-4xl), 5vw, var(--text-5xl))',
              textAlign: 'center',
              marginBottom: 'var(--space-2xl)',
              textShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: '700'
            }}
          >
            Project Spotlight
          </h2>
          <p 
            className="text-slate-300 max-w-3xl mx-auto leading-relaxed"
            style={{ 
              fontSize: 'var(--text-lg)',
              marginBottom: 'var(--space-2xl)'
            }}
          >
            Where bleeding-edge tech meets caffeinated obsession. These are the crown jewels of my digital empire.
          </p>
        </motion.div>

        {/* Desktop Grid View */}
        <motion.div
          className="hidden md:grid md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ 
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-xl)'
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>

        {/* Mobile Carousel View */}
        <div className="md:hidden relative overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `calc(-${currentIndex * 100}% - ${currentIndex * 1.5}rem)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ gap: 'var(--space-md)' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="flex-shrink-0"
                style={{ 
                  width: 'calc(100vw - 4rem)',
                  maxWidth: '480px',
                  transform: `scale(${index === currentIndex ? 1 : 0.9})`,
                  opacity: index === currentIndex ? 1 : 0.6
                }}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Navigation */}
          <div className="flex justify-center items-center mt-6 gap-4">
            <button
              onClick={prevCard}
              className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
              aria-label="Previous project"
            >
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex 
                      ? 'bg-purple-400' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextCard}
              className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
              aria-label="Next project"
            >
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Swipe Instructions */}
          <p className="text-center text-slate-400 text-sm mt-4">
            Swipe or use arrows to navigate
          </p>
        </div>
      </div>
    </section>
  );
}