'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
  { label: 'PROJECTS', href: '/projects' },
  { label: 'MAATSCHAPPELIJK', href: '/maatschappelijk' },
  { label: 'ABM TOOLING', href: '/for' },
  { label: 'PLAYGROUND', href: '/playground' },
  { label: 'CONTACT', href: '/contact' },
];

const menuImages: Record<string, string> = {
  PROJECTS: '/menu-photo-1.jpg',
  MAATSCHAPPELIJK: '/samba-gambia.jpg',
  'ABM TOOLING': '/menu-photo-2.jpg',
  PLAYGROUND: '/menu-photo-3.jpg',
  CONTACT: '/samba-casual.jpg',
};

const staggerContainer = {
  open: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const itemVariants = {
  closed: { y: 80, opacity: 0 },
  open: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 80, damping: 18 } },
};

interface OverlayMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function OverlayMenuContent({ isOpen, onClose }: OverlayMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState('/menu-photo-1.jpg');

  const handleHover = useCallback((label: string) => {
    setHoveredItem(label);
    setActiveImage(menuImages[label]);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #E8607C 0%, #E5546F 30%, #D94B6A 60%, #C94060 100%)' }} />
          <div className="relative h-full flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-8 lg:px-12 py-6">
              <Link href="/" className="flex items-center gap-2 group" onClick={onClose}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-110" style={{ backgroundColor: '#023047', color: '#ffffff' }}>SJ</div>
                <span className="font-bold text-lg tracking-tight" style={{ color: '#023047' }}>Samba Jarju</span>
              </Link>
              <button onClick={onClose} className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer" style={{ backgroundColor: '#023047', color: '#ffffff' }} aria-label="Close menu">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Two columns */}
            <div className="flex-1 flex items-center px-8 lg:px-12">
              <div className="w-full grid grid-cols-12 gap-8 items-center">
                <motion.div className="col-span-7 flex flex-col" variants={staggerContainer} initial="closed" animate="open" exit="closed">
                  {menuItems.map((item, index) => (
                    <motion.div key={item.label} variants={itemVariants} className="overflow-hidden">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        onMouseEnter={() => handleHover(item.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="group flex items-center gap-4 py-1 cursor-pointer no-underline"
                      >
                        <span className="text-sm font-mono tracking-widest min-w-[2rem] transition-opacity duration-300" style={{ color: '#023047', opacity: hoveredItem === item.label ? 1 : 0.4 }}>
                          0{index + 1}
                        </span>
                        <span
                          className="font-black tracking-tighter leading-[0.85] transition-all duration-300"
                          style={{
                            fontSize: 'clamp(2.5rem, 6vw, 6.5rem)',
                            color: hoveredItem === item.label ? '#023047' : hoveredItem ? 'rgba(2, 48, 71, 0.25)' : item.label === 'CONTACT' ? '#023047' : 'rgba(255, 255, 255, 0.9)',
                            transform: hoveredItem === item.label ? 'translateX(12px)' : 'translateX(0px)',
                          }}
                        >
                          {item.label}
                        </span>
                        <ArrowUpRight className="transition-all duration-300" style={{ width: '2rem', height: '2rem', color: '#023047', opacity: hoveredItem === item.label ? 1 : 0, transform: hoveredItem === item.label ? 'translateX(0) translateY(0)' : 'translateX(-8px) translateY(8px)' }} />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div className="col-span-5 relative flex items-center justify-center" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4', maxHeight: '70vh', borderRadius: '1.5rem', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] } }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                        className="absolute inset-0"
                      >
                        <Image src={activeImage} alt="Samba Jarju" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 40vw" priority />
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 40%)' }} />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom bar */}
            <motion.div className="flex items-center justify-between px-8 lg:px-12 py-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
              <div className="flex items-center gap-6 text-sm" style={{ color: 'rgba(2, 48, 71, 0.6)' }}>
                <span>Rotterdam, NL</span>
                <span>KvK: 83474889</span>
              </div>
              <div className="flex items-center gap-4">
                {[
                  { href: 'mailto:samba@sambajarju.nl', icon: <Mail className="w-4 h-4" /> },
                  { href: 'tel:+31687975656', icon: <Phone className="w-4 h-4" /> },
                  { href: 'https://www.linkedin.com/in/sambajarju/', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
                ].map((item, i) => (
                  <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ backgroundColor: 'rgba(2, 48, 71, 0.1)', color: '#023047' }}>
                    {item.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OverlayMenu(props: OverlayMenuProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(<OverlayMenuContent {...props} />, document.body);
}

export function HamburgerIcon({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-[5px] transition-all duration-200 cursor-pointer group ${className || ''}`}
      style={{ color: 'var(--foreground)' }}
      aria-label="Open menu"
    >
      <span className="block w-5 h-[2px] rounded-full bg-current transition-all duration-200 group-hover:w-4" />
      <span className="block w-3.5 h-[2px] rounded-full transition-all duration-200 group-hover:w-5" style={{ backgroundColor: '#EF476F' }} />
      <span className="block w-5 h-[2px] rounded-full bg-current transition-all duration-200 group-hover:w-3" />
    </button>
  );
}
