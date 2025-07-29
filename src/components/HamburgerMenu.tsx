import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { label: 'Professional Journey', href: '#journey' },
    { label: 'Homelab Empire', href: '#homelab' },
    { label: 'Project Spotlight', href: '#projects' },
    { label: 'About Me', href: '#bio' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <motion.button
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-[60] p-3 bg-slate-800/90 border border-slate-600/50 rounded-lg backdrop-blur-sm md:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-slate-300" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-slate-300" />
        )}
      </motion.button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.div
              className="absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-l border-slate-600/50"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="p-6 pt-20">
                {/* Navigation Items */}
                <nav className="space-y-4">
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="block px-4 py-3 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all duration-200 border border-transparent hover:border-slate-600/50"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-medium">{item.label}</span>
                    </motion.a>
                  ))}
                </nav>

                {/* Footer */}
                <motion.div
                  className="mt-12 pt-6 border-t border-slate-600/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-slate-400 text-sm text-center">
                    Navigation Menu
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu;