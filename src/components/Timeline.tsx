import React from 'react';
import { motion } from 'framer-motion';
import { BuildingOfficeIcon, BeakerIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface TimelineItem {
  id: string;
  dates: string;
  title: string;
  company: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
}

const timelineData: TimelineItem[] = [
  {
    id: 'botrista-current',
    dates: 'Jan 2025 - Present',
    title: 'Manager, Regional Sales Operations',
    company: 'Botrista, Inc.',
    summary: 'Currently leading regional sales operations and partner growth initiatives across the Dallas-Fort Worth metroplex. Orchestrating beverage robotics expansion with a focus on operational excellence and strategic partnerships.',
    icon: BuildingOfficeIcon
  },
  {
    id: 'botrista-partner',
    dates: 'Jan 2024 - Jan 2025',
    title: 'Partner Operations Manager',
    company: 'Botrista, Inc.',
    summary: 'Managed partner operational efficiency and conducted advanced diagnostics for beverage robotics across multiple regions. Scaled operations nationwide through process automation and strategic partner relationships.',
    icon: BeakerIcon
  },
  {
    id: 'botrista-growth',
    dates: 'May 2023 - Feb 2024',
    title: 'Partner Growth Manager',
    company: 'Botrista, Inc.',
    summary: 'Drove partner growth initiatives and market expansion strategies. Established operational frameworks for rapid scaling while maintaining quality standards in beverage robotics deployment.',
    icon: ComputerDesktopIcon
  },
  {
    id: 'chowbotics',
    dates: 'Mar 2018 - Oct 2022',
    title: 'Product Support Manager',
    company: 'DoorDash (Chowbotics)',
    summary: 'Developed proactive support strategies that reduced downtime by 80% for cold bowl-based robots responsible for $17M in business. Managed international support teams and engineered comprehensive customer service playbooks.',
    icon: ComputerDesktopIcon
  },
  {
    id: 'apple',
    dates: 'Jan 2010 - Mar 2018',
    title: 'Genius & Channel Support',
    company: 'Apple Inc.',
    summary: '8+ years across multiple Apple roles including Genius positions and Channel Service Support. Delivered world-class technical support, trained field technicians, and coordinated employee training sessions.',
    icon: DevicePhoneMobileIcon
  },
  {
    id: 'homelab',
    dates: 'Mar 2012 - Present',
    title: 'HomeLab + Personal Projects',
    company: 'Self-Hosted Infrastructure',
    summary: 'Maintaining Unraid-based homelab with 50+ Docker containers, custom bridge networks, and Unifi-managed VLANs. Working with AI model inference, n8n automation workflows, and local LLM training using Stable Diffusion and LocalAI.',
    icon: ComputerDesktopIcon
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function Timeline() {
  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      style={{ gap: 'var(--space-md)' }}
    >
      {timelineData.map((item, index) => {
        const IconComponent = item.icon;
        
        return (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="group relative"
          >
            <div 
              className="timeline-card bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
              style={{ padding: 'var(--space-md)' }}
            >
              {/* Icon and Date Badge */}
              <div 
                className="flex items-start justify-between" 
                style={{ marginBottom: 'var(--space-sm)' }}
              >
                <div 
                  className="flex items-center" 
                  style={{ gap: 'var(--space-xs)' }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-purple-500/30 group-hover:border-purple-400/50 transition-colors">
                    <IconComponent className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </div>
                  <div>
                    <span 
                      className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-full"
                      style={{ 
                        fontSize: 'var(--text-sm)', 
                        padding: '0.25rem 0.75rem'
                      }}
                    >
                      {item.dates}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <h3 
                  className="font-bold text-white group-hover:text-purple-300 transition-colors"
                  style={{ fontSize: 'var(--text-xl)' }}
                >
                  {item.title}
                </h3>
                <p 
                  className="font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
                  style={{ fontSize: 'var(--text-lg)' }}
                >
                  {item.company}
                </p>
                <p 
                  className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors"
                  style={{ fontSize: 'var(--text-base)' }}
                >
                  {item.summary}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}