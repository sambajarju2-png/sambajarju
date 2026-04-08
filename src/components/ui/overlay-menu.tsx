'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
  { label: 'PROJECTS', href: '/projects' },
  { label: 'BLOG', href: '/blog' },
  { label: 'MAATSCHAPPELIJK', href: '/maatschappelijk' },
  { label: 'ABM OUTREACH', href: '/abm-outreach' },
  { label: 'PLAYGROUND', href: '/playground' },
  { label: 'CONTACT', href: '/contact' },
];

const menuImages: Record<string, string> = {
  PROJECTS: '/samba-gambia.jpg',
  BLOG: '/samba-casual.jpg',
  MAATSCHAPPELIJK: '/maatschappelijk.jpg',
  'ABM OUTREACH': '/menu-photo-2.jpg',
  PLAYGROUND: '/menu-photo-3.jpg',
  CONTACT: '/menu-photo-1.jpg',
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
                <svg className="h-5" viewBox="36 12 940 176" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M132 136H36V120H132C134.25 120 136.125 119.25 137.625 117.75C139.208 116.167 140 114.25 140 112C140 109.75 139.208 107.875 137.625 106.375C136.125 104.792 134.25 104 132 104H100C93.3333 104 87.6667 101.667 83 97C78.3333 92.3333 76 86.6667 76 80C76 73.3333 78.3333 67.6667 83 63C87.6667 58.3333 93.3333 56 100 56H148V72H100C97.75 72 95.8333 72.7917 94.25 74.375C92.75 75.875 92 77.75 92 80C92 82.25 92.75 84.1667 94.25 85.75C95.8333 87.25 97.75 88 100 88H132C138.667 88 144.333 90.3333 149 95C153.667 99.6667 156 105.333 156 112C156 118.667 153.667 124.333 149 129C144.333 133.667 138.667 136 132 136ZM155.125 136L195.125 52L235.125 136H217.125L195.125 90L173.125 136H155.125ZM255.875 88V168H239.875V56H255.875L287.875 116L319.875 56H335.875V136H319.875V88L295.875 136H279.875L255.875 88ZM409.625 136H353.625V56H409.625C416.292 56 421.958 58.3333 426.625 63C431.292 67.6667 433.625 73.3333 433.625 80C433.625 86.1667 431.625 91.5 427.625 96C431.625 100.5 433.625 105.833 433.625 112C433.625 118.667 431.292 124.333 426.625 129C421.958 133.667 416.292 136 409.625 136ZM369.625 120H409.625C411.875 120 413.75 119.25 415.25 117.75C416.833 116.167 417.625 114.25 417.625 112C417.625 109.75 416.833 107.875 415.25 106.375C413.75 104.792 411.875 104 409.625 104H389.625V88H409.625C411.875 88 413.75 87.25 415.25 85.75C416.833 84.1667 417.625 82.25 417.625 80C417.625 77.75 416.833 75.875 415.25 74.375C413.75 72.7917 411.875 72 409.625 72H369.625V120ZM432.75 136L472.75 52L512.75 136H494.75L472.75 90L450.75 136H432.75ZM624.75 56H640.75V136C640.75 142.667 638.417 148.333 633.75 153C629.083 157.667 623.417 160 616.75 160C610.083 160 604.417 157.667 599.75 153C595.083 148.333 592.75 142.667 592.75 136H608.75C608.75 138.25 609.5 140.125 611 141.625C612.583 143.208 614.5 144 616.75 144C619 144 620.875 143.208 622.375 141.625C623.958 140.125 624.75 138.25 624.75 136V56ZM645.5 136L685.5 52L725.5 136H707.5L685.5 90L663.5 136H645.5ZM745.5 136H729.5V56H785.5C792.167 56 797.833 58.3333 802.5 63C807.167 67.6667 809.5 73.3333 809.5 80C809.5 86.6667 807.167 92.3333 802.5 97C797.833 101.667 792.167 104 785.5 104H782L817.5 168H801.5L757.5 88H785.5C787.75 88 789.625 87.25 791.125 85.75C792.708 84.1667 793.5 82.25 793.5 80C793.5 77.75 792.708 75.875 791.125 74.375C789.625 72.7917 787.75 72 785.5 72H745.5V136ZM851.25 56H867.25V152C867.25 158.667 864.917 164.333 860.25 169C855.583 173.667 849.917 176 843.25 176C836.583 176 830.917 173.667 826.25 169C821.583 164.333 819.25 158.667 819.25 152H835.25C835.25 154.25 836 156.125 837.5 157.625C839.083 159.208 841 160 843.25 160C845.5 160 847.375 159.208 848.875 157.625C850.458 156.125 851.25 154.25 851.25 152V56ZM880.75 96V56H896.75V96C896.75 102.667 899.083 108.333 903.75 113C908.417 117.667 914.083 120 920.75 120C927.417 120 933.083 117.667 937.75 113C942.417 108.333 944.75 102.667 944.75 96V16H960.75V96C960.75 107.083 956.833 116.542 949 124.375C941.25 132.125 931.833 136 920.75 136C909.667 136 900.208 132.125 892.375 124.375C884.625 116.542 880.75 107.083 880.75 96Z" fill="#023047"/>
                </svg>
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
                    <AnimatePresence mode="sync">
                      <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] } }}
                        exit={{ opacity: 0, transition: { duration: 0.4 } }}
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
