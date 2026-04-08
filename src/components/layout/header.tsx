'use client';

import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { CommandMenu } from '@/components/ui/command-menu';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { OverlayMenu, HamburgerIcon } from '@/components/ui/overlay-menu';
import Link from 'next/link';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const base = isHome ? '' : '/';
  const links = [
    { href: `${base}#about`, label: t('about') },
    { href: `${base}#projects`, label: t('projects') },
    { href: `${base}#experience`, label: t('experience') },
    { href: `${base}#tools`, label: t('tools') },
    { href: `${base}#contact`, label: t('contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="h-5 sm:h-6 text-foreground" viewBox="36 12 940 176" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M132 136H36V120H132C134.25 120 136.125 119.25 137.625 117.75C139.208 116.167 140 114.25 140 112C140 109.75 139.208 107.875 137.625 106.375C136.125 104.792 134.25 104 132 104H100C93.3333 104 87.6667 101.667 83 97C78.3333 92.3333 76 86.6667 76 80C76 73.3333 78.3333 67.6667 83 63C87.6667 58.3333 93.3333 56 100 56H148V72H100C97.75 72 95.8333 72.7917 94.25 74.375C92.75 75.875 92 77.75 92 80C92 82.25 92.75 84.1667 94.25 85.75C95.8333 87.25 97.75 88 100 88H132C138.667 88 144.333 90.3333 149 95C153.667 99.6667 156 105.333 156 112C156 118.667 153.667 124.333 149 129C144.333 133.667 138.667 136 132 136ZM155.125 136L195.125 52L235.125 136H217.125L195.125 90L173.125 136H155.125ZM255.875 88V168H239.875V56H255.875L287.875 116L319.875 56H335.875V136H319.875V88L295.875 136H279.875L255.875 88ZM409.625 136H353.625V56H409.625C416.292 56 421.958 58.3333 426.625 63C431.292 67.6667 433.625 73.3333 433.625 80C433.625 86.1667 431.625 91.5 427.625 96C431.625 100.5 433.625 105.833 433.625 112C433.625 118.667 431.292 124.333 426.625 129C421.958 133.667 416.292 136 409.625 136ZM369.625 120H409.625C411.875 120 413.75 119.25 415.25 117.75C416.833 116.167 417.625 114.25 417.625 112C417.625 109.75 416.833 107.875 415.25 106.375C413.75 104.792 411.875 104 409.625 104H389.625V88H409.625C411.875 88 413.75 87.25 415.25 85.75C416.833 84.1667 417.625 82.25 417.625 80C417.625 77.75 416.833 75.875 415.25 74.375C413.75 72.7917 411.875 72 409.625 72H369.625V120ZM432.75 136L472.75 52L512.75 136H494.75L472.75 90L450.75 136H432.75ZM624.75 56H640.75V136C640.75 142.667 638.417 148.333 633.75 153C629.083 157.667 623.417 160 616.75 160C610.083 160 604.417 157.667 599.75 153C595.083 148.333 592.75 142.667 592.75 136H608.75C608.75 138.25 609.5 140.125 611 141.625C612.583 143.208 614.5 144 616.75 144C619 144 620.875 143.208 622.375 141.625C623.958 140.125 624.75 138.25 624.75 136V56ZM645.5 136L685.5 52L725.5 136H707.5L685.5 90L663.5 136H645.5ZM745.5 136H729.5V56H785.5C792.167 56 797.833 58.3333 802.5 63C807.167 67.6667 809.5 73.3333 809.5 80C809.5 86.6667 807.167 92.3333 802.5 97C797.833 101.667 792.167 104 785.5 104H782L817.5 168H801.5L757.5 88H785.5C787.75 88 789.625 87.25 791.125 85.75C792.708 84.1667 793.5 82.25 793.5 80C793.5 77.75 792.708 75.875 791.125 74.375C789.625 72.7917 787.75 72 785.5 72H745.5V136ZM851.25 56H867.25V152C867.25 158.667 864.917 164.333 860.25 169C855.583 173.667 849.917 176 843.25 176C836.583 176 830.917 173.667 826.25 169C821.583 164.333 819.25 158.667 819.25 152H835.25C835.25 154.25 836 156.125 837.5 157.625C839.083 159.208 841 160 843.25 160C845.5 160 847.375 159.208 848.875 157.625C850.458 156.125 851.25 154.25 851.25 152V56ZM880.75 96V56H896.75V96C896.75 102.667 899.083 108.333 903.75 113C908.417 117.667 914.083 120 920.75 120C927.417 120 933.083 117.667 937.75 113C942.417 108.333 944.75 102.667 944.75 96V16H960.75V96C960.75 107.083 956.833 116.542 949 124.375C941.25 132.125 931.833 136 920.75 136C909.667 136 900.208 132.125 892.375 124.375C884.625 116.542 880.75 107.083 880.75 96Z" fill="currentColor"/>
          </svg>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden lg:block"><CommandMenu /></span>
          <ThemeToggle />
          <LanguageToggle />
          <HamburgerIcon onClick={() => setOverlayOpen(true)} />
        </div>
      </div>

      {/* Full-screen overlay menu (mobile + desktop) */}
      <OverlayMenu isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </header>
  );
}
