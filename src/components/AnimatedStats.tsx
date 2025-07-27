import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  CubeIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface StatItem {
  id: string;
  value: string;
  numericValue?: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const statsData: StatItem[] = [
  {
    id: 'containers',
    value: '50+',
    numericValue: 50,
    label: 'Docker Containers',
    suffix: '+',
    icon: CubeIcon,
    iconColor: 'text-blue-400'
  },
  {
    id: 'vlans',
    value: '3+',
    numericValue: 3,
    label: 'Network VLANs',
    suffix: '+',
    icon: GlobeAltIcon,
    iconColor: 'text-emerald-400'
  },
  {
    id: 'uptime',
    value: '99.9%',
    numericValue: 99.9,
    label: 'Uptime Target',
    suffix: '%',
    icon: CheckBadgeIcon,
    iconColor: 'text-green-400'
  },
  {
    id: 'projects',
    value: '∞',
    numericValue: null, // Special case for infinity
    label: 'Tinkering Projects',
    icon: WrenchScrewdriverIcon,
    iconColor: 'text-orange-400'
  }
];

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ from, to, duration = 2, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = from + (to - from) * easeOutQuart;
      
      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, from, to, duration]);

  const formatValue = (value: number): string => {
    if (to % 1 === 0) {
      // Integer values
      return Math.floor(value).toString();
    } else {
      // Decimal values (like 99.9)
      return value.toFixed(1);
    }
  };

  return (
    <span 
      ref={nodeRef} 
      className="font-bold text-purple-400 block drop-shadow-sm"
      style={{ fontSize: 'var(--text-4xl)' }}
    >
      {prefix}{formatValue(count)}{suffix}
    </span>
  );
}

interface StatCardProps {
  stat: StatItem;
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "0px" });
  const IconComponent = stat.icon;

  // Special animation for uptime icon (CheckBadgeIcon)
  const iconAnimation = stat.id === 'uptime' ? {
    scale: [1, 1.1, 1],
    rotate: [0, 5, -5, 0],
  } : stat.id === 'projects' ? {
    rotate: [0, 15, -15, 0],
  } : {
    y: [0, -2, 0],
  };

  const iconTransition = stat.id === 'uptime' ? {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  } : stat.id === 'projects' ? {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  } : {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut"
  };

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-full h-full"
    >
      <div 
        className="group relative text-center rounded-xl bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] min-h-[140px] flex flex-col justify-center shadow-[0_4px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_20px_rgba(165,111,255,0.3)]"
        style={{ 
          padding: 'var(--space-md)', 
          margin: 'var(--space-xs)' 
        }}
      >
        {/* Icon */}
        <motion.div
          className="flex justify-center"
          style={{ marginBottom: 'var(--space-xs)' }}
          animate={iconAnimation}
          transition={iconTransition}
        >
          <IconComponent className={`w-8 h-8 ${stat.iconColor} group-hover:scale-110 transition-transform duration-300 drop-shadow-sm`} />
        </motion.div>
        
        {/* Number */}
        <div style={{ marginBottom: 'var(--space-xs)' }}>
          {stat.numericValue !== null ? (
            <AnimatedCounter
              from={0}
              to={stat.numericValue}
              duration={2 + index * 0.2}
              suffix={stat.suffix}
              prefix={stat.prefix}
            />
          ) : (
            <span 
              className="font-bold text-purple-400 block drop-shadow-sm"
              style={{ fontSize: 'var(--text-4xl)' }}
            >
              {stat.value}
            </span>
          )}
        </div>
        
        {/* Label */}
        <div 
          className="text-slate-300 font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          style={{ fontSize: 'var(--text-sm)' }}
        >
          {stat.label}
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}

export default function AnimatedStats() {
  return (
    <div 
      className="relative w-full bg-white/5 backdrop-blur-3xl rounded-3xl shadow-2xl shadow-purple-500/10"
      style={{ padding: 'var(--space-lg)' }}
    >
      {/* Unified Stats Container with Internal Dividers */}
      <div className="flex flex-col sm:flex-row items-stretch">
        {statsData.map((stat, index) => (
          <div 
            key={stat.id} 
            className={`flex-1 relative ${
              index < statsData.length - 1 ? 'sm:border-r sm:border-white/10' : ''
            }`}
          >
            <StatCard stat={stat} index={index} />
          </div>
        ))}
      </div>
      
      {/* Decorative elements */}
      <motion.div
        className="absolute bg-purple-500/20 rounded-full blur-sm"
        style={{ 
          top: '-1rem', 
          left: '-1rem', 
          width: 'var(--space-lg)', 
          height: 'var(--space-lg)' 
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        aria-hidden="true"
      />
      
      <motion.div
        className="absolute bg-cyan-500/20 rounded-full blur-sm"
        style={{ 
          bottom: '-1rem', 
          right: '-1rem', 
          width: 'var(--space-md)', 
          height: 'var(--space-md)' 
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        aria-hidden="true"
      />
    </div>
  );
}