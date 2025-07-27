import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EasterEgg: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isHyperspaceActive, setIsHyperspaceActive] = useState(false);

  // Reset click count after 3 seconds of inactivity
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const triggerHyperspace = () => {
    setIsHyperspaceActive(true);
    
    // After hyperspace animation, show modal
    setTimeout(() => {
      setIsHyperspaceActive(false);
      setIsModalOpen(true);
    }, 4000); // 4 second hyperspace journey
  };

  const handleRobotClick = () => {
    setClickCount(prev => prev + 1);
    
    // Trigger hyperspace on 5 consecutive clicks
    if (clickCount === 4) {
      triggerHyperspace();
      setClickCount(0);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Generate random stars for hyperspace effect
  const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 2 + 1
    }));
  };

  const stars = generateStars(150);

  return (
    <>
      {/* Hidden Robot Icon - positioned in hero section */}
      <motion.div
        className="fixed z-50 cursor-pointer"
        style={{ 
          bottom: 'var(--space-sm)', 
          right: 'var(--space-sm)' 
        }}
        initial={{ opacity: 0.3, scale: 0.8 }}
        animate={{ 
          opacity: clickCount > 0 ? 0.8 : 0.3,
          scale: clickCount > 0 ? 1.1 : 0.8,
          rotate: clickCount * 72 // Spins with each click
        }}
        whileHover={{ 
          scale: 1.2, 
          opacity: 1,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRobotClick}
        title="🤖 Something's hiding here... (5 clicks)"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/30 backdrop-blur-sm">
          <span 
            className="filter drop-shadow-lg"
            style={{ fontSize: 'var(--text-3xl)' }}
          >
            🤖
          </span>
        </div>
        
        {/* Click indicator */}
        {clickCount > 0 && (
          <motion.div
            className="absolute bg-purple-500 rounded-full flex items-center justify-center text-white font-bold"
            style={{
              top: '-0.5rem',
              right: '-0.5rem',
              width: 'var(--space-md)',
              height: 'var(--space-md)',
              fontSize: 'var(--text-xs)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {clickCount}
          </motion.div>
        )}
      </motion.div>

      {/* Hyperspace Jump Animation */}
      <AnimatePresence>
        {isHyperspaceActive && (
          <motion.div
            className="fixed inset-0 z-[10000] bg-black overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Star Field */}
            <div className="relative w-full h-full">
              {stars.map((star) => (
                <motion.div
                  key={star.id}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                  }}
                  initial={{ 
                    scale: 0.1, 
                    opacity: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    scale: [0.1, 1, 0.1],
                    opacity: [0, 1, 0],
                    x: [(star.x - 50) * -20, (star.x - 50) * 20],
                    y: [(star.y - 50) * -20, (star.y - 50) * 20]
                  }}
                  transition={{
                    duration: star.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                  }}
                />
              ))}
              
              {/* Central Light Burst */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 2, 10, 0],
                  opacity: [0, 0.3, 0.8, 0]
                }}
                transition={{
                  duration: 3,
                  times: [0, 0.2, 0.8, 1],
                  ease: "easeInOut"
                }}
              >
                <div className="w-96 h-96 bg-gradient-radial from-white via-blue-200 to-transparent rounded-full blur-3xl" />
              </motion.div>

              {/* Hyperspace Lines */}
              {Array.from({ length: 50 }, (_, i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: '2px',
                    height: '100px',
                    transformOrigin: 'center center'
                  }}
                  initial={{ 
                    scaleY: 0,
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  animate={{ 
                    scaleY: [0, 20, 0],
                    opacity: [0, 1, 0],
                    x: [(Math.random() - 0.5) * 2000],
                    y: [(Math.random() - 0.5) * 2000]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                  }}
                />
              ))}

              {/* Hyperspace Text */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1.2, 0] }}
                transition={{ 
                  duration: 4,
                  times: [0, 0.2, 0.8, 1],
                  ease: "easeInOut"
                }}
              >
                <h1 
                  className="font-bold text-cyan-400 font-mono tracking-wider"
                  style={{ 
                    fontSize: 'var(--text-6xl)', 
                    marginBottom: 'var(--space-sm)' 
                  }}
                >
                  HYPERSPACE JUMP
                </h1>
                <p 
                  className="text-white opacity-80 font-mono"
                  style={{ fontSize: 'var(--text-xl)' }}
                >
                  Entering digital wormhole...
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-purple-500/50 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl shadow-purple-500/20"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-slate-300" />
              </button>

              {/* Content */}
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-6xl mx-auto w-fit"
                >
                  🚀
                </motion.div>

                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    HYPERSPACE JUMP COMPLETE
                  </h3>
                  <div className="space-y-4 text-slate-300 text-left">
                    <p className="text-sm bg-slate-800/50 p-3 rounded border-l-4 border-cyan-500">
                      <strong className="text-cyan-400">JUMP COORDINATES:</strong> Welcome to the digital frontier, fellow space traveler! 
                      You've successfully navigated through my homelab's hyperspace corridors. 
                      The Millennium Falcon has nothing on my Docker orchestration skills.
                    </p>
                    
                    <p className="text-sm bg-slate-800/50 p-3 rounded border-l-4 border-purple-500">
                      <strong className="text-purple-400">WARP DRIVE STATUS:</strong> My infrastructure operates at lightspeed efficiency. 
                      50+ containers, 3 VLANs, and enough automation to make R2-D2 jealous. 
                      This isn't just a homelab—it's a technological Death Star (but for good).
                    </p>

                    <p className="text-sm bg-slate-800/50 p-3 rounded border-l-4 border-emerald-500">
                      <strong className="text-emerald-400">FORCE SENSITIVITY:</strong> The hyperspace jump has awakened something... 
                      You now possess the ancient knowledge that the best infrastructure 
                      is the one that runs itself while you sleep. Use this power wisely.
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  RETURN TO NORMAL SPACE
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEgg;