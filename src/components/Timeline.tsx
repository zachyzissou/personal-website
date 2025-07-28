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
    id: 'botrista-2023',
    dates: 'Mar 2023 - Present',
    title: 'Partner Operations Manager',
    company: 'Botrista, Inc.',
    summary: 'Orchestrating beverage robotics across multiple U.S. regions. Managing partner operational efficiency, conducting advanced diagnostics, and scaling operations nationwide through process automation.',
    icon: BeakerIcon
  },
  {
    id: 'botrista-sales',
    dates: 'Jan 2023 - Mar 2023',
    title: 'Manager, Regional Sales Operations',
    company: 'Botrista, Inc.',
    summary: 'Led regional sales operations and partner onboarding initiatives. Streamlined sales processes and established operational frameworks for rapid market expansion.',
    icon: BuildingOfficeIcon
  },
  {
    id: 'chowbotics',
    dates: 'Mar 2018 - Oct 2022',
    title: 'Product Support Manager',
    company: 'Chowbotics by DoorDash',
    summary: 'Developed technical support strategies that reduced downtime by 80%. Led a global support team providing advanced troubleshooting for Linux-based robotic systems. The stuff that made autonomous food prep actually work.',
    icon: ComputerDesktopIcon
  },
  {
    id: 'apple',
    dates: 'Sep 2010 - Nov 2018',
    title: 'Genius & AppleCare Support',
    company: 'Apple Inc.',
    summary: '8 years of Apple mastery. Provided technical support and troubleshooting, managed complex escalations, and trained technicians. Where I learned that great support is an art form.',
    icon: DevicePhoneMobileIcon
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