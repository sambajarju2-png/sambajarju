'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/motion';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export function Contact() {
  const t = useTranslations('contact');

  const actions = [
    { icon: Phone, label: t('cta_phone'), href: 'tel:+31687975656', color: 'hover:border-emerald-400 hover:text-emerald-500' },
    { icon: Mail, label: t('cta_email'), href: 'mailto:samba@sambajarju.nl', color: 'hover:border-accent hover:text-accent' },
    { icon: LinkedinIcon, label: t('cta_linkedin'), href: 'https://www.linkedin.com/in/sambajarju/', color: 'hover:border-blue-400 hover:text-blue-500' },
  ];

  return (
    <section id="contact" className="py-24 bg-background-alt relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider">
            <span className="w-8 h-px bg-accent" />
            {t('label')}
            <span className="w-8 h-px bg-accent" />
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mt-4">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-lg text-foreground-muted mt-4 max-w-lg mx-auto">{t('subtitle')}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            {actions.map(({ icon: Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`group flex items-center gap-3 px-6 py-4 rounded-xl border border-border bg-surface font-semibold text-foreground transition-all duration-200 hover:shadow-md w-full sm:w-auto justify-center ${color}`}
              >
                <Icon className="w-5 h-5" />
                {label}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
