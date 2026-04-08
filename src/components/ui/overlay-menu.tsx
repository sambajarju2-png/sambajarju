'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, LinkedinIcon, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const menuItems = [
  { label: 'ABOUT', href: '#about' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'TOOLS', href: '#tools' },
  { label: 'CONTACT', href: '#contact' },
];

const menuImages: Record<string, string> = {
  ABOUT: '/menu-photo-1.jpg',
  PROJECTS: '/menu-photo-2.jpg',
  EXPERIENCE: '/menu-photo-3.jpg',
  TOOLS: '/menu-photo-1.jpg',
  CONTACT: '/menu-photo-2.jpg',
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const staggerContainer = {
  open: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants = {
  closed: { y: 80, opacity: 0, skewY: 4 },
  open: {
    y: 0,
    opacity: 1,
    skewY: 0,
    transition: { type: 'spring', stiffness: 80, damping: 18 },
  },
};

const imageVariants = {
  enter: { opacity: 0, scale: 1.1, rotate: -2 },
  center: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    rotate: 2,
    transition: { duration: 0.3 },
  },
};

interface OverlayMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OverlayMenu({ isOpen, onClose }: OverlayMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState('/menu-photo-1.jpg');

  const handleHover = useCallback((label: string) => {
    setHoveredItem(label);
    setActiveImage(menuImages[label]);
  }, []);

  const handleClick = useCallback(
    (href: string) => {
      onClose();
      // Small delay so overlay closes before scroll
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Background — pink gradient matching photos */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, #E8607C 0%, #E5546F 30%, #D94B6A 60%, #C94060 100%)',
            }}
          />

          {/* Subtle noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-8 lg:px-12 py-6">
              <a href="#" className="flex items-center gap-2 group" onClick={(e) => { e.preventDefault(); handleClick('#'); }}>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: '#023047', color: '#ffffff' }}
                >
                  SJ
                </div>
                <span className="font-bold text-lg tracking-tight" style={{ color: '#023047' }}>
                  Samba Jarju
                </span>
              </a>

              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer"
                style={{ backgroundColor: '#023047', color: '#ffffff' }}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Main content — two columns */}
            <div className="flex-1 flex items-center px-8 lg:px-12">
              <div className="w-full grid grid-cols-12 gap-8 items-center">
                {/* Left column — menu links */}
                <motion.div
                  className="col-span-7 flex flex-col"
                  variants={staggerContainer}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      variants={itemVariants}
                      className="overflow-hidden"
                    >
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(item.href);
                        }}
                        onMouseEnter={() => handleHover(item.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="group flex items-center gap-4 py-1 cursor-pointer transition-all duration-300"
                        style={{ textDecoration: 'none' }}
                      >
                        {/* Number */}
                        <span
                          className="text-sm font-mono tracking-widest opacity-40 transition-opacity duration-300 min-w-[2rem]"
                          style={{
                            color: '#023047',
                            opacity: hoveredItem === item.label ? 1 : 0.4,
                          }}
                        >
                          0{index + 1}
                        </span>

                        {/* Label */}
                        <span
                          className="font-black tracking-tighter leading-[0.85] transition-all duration-300"
                          style={{
                            fontSize: 'clamp(3rem, 7vw, 7rem)',
                            color:
                              hoveredItem === item.label
                                ? '#023047'
                                : hoveredItem
                                  ? 'rgba(2, 48, 71, 0.25)'
                                  : item.label === 'CONTACT'
                                    ? '#023047'
                                    : 'rgba(255, 255, 255, 0.9)',
                            transform:
                              hoveredItem === item.label
                                ? 'translateX(12px)'
                                : 'translateX(0px)',
                            WebkitTextStroke:
                              hoveredItem && hoveredItem !== item.label
                                ? '1px rgba(2, 48, 71, 0.15)'
                                : 'none',
                          }}
                        >
                          {item.label}
                        </span>

                        {/* Arrow */}
                        <ArrowUpRight
                          className="transition-all duration-300"
                          style={{
                            width: '2rem',
                            height: '2rem',
                            color: '#023047',
                            opacity: hoveredItem === item.label ? 1 : 0,
                            transform:
                              hoveredItem === item.label
                                ? 'translateX(0) translateY(0)'
                                : 'translateX(-8px) translateY(8px)',
                          }}
                        />
                      </a>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Right column — image */}
                <motion.div
                  className="col-span-5 relative flex items-center justify-center"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
                >
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: '3/4',
                      maxHeight: '70vh',
                      borderRadius: '1.5rem',
                      boxShadow: '0 40px 80px rgba(0,0,0,0.2)',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImage}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0"
                      >
                        <Image
                          src={activeImage}
                          alt="Samba Jarju"
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 768px) 100vw, 40vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Subtle overlay gradient on image */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 40%)',
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom bar */}
            <motion.div
              className="flex items-center justify-between px-8 lg:px-12 py-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center gap-6 text-sm" style={{ color: 'rgba(2, 48, 71, 0.6)' }}>
                <span>Rotterdam, NL</span>
                <span>KvK: 83474889</span>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="mailto:samba@sambajarju.nl"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: 'rgba(2, 48, 71, 0.1)', color: '#023047' }}
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="tel:+31687975656"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: 'rgba(2, 48, 71, 0.1)', color: '#023047' }}
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sambajarju/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: 'rgba(2, 48, 71, 0.1)', color: '#023047' }}
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
