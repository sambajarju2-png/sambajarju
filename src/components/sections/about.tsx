'use client';

import { useTranslations } from 'next-intl';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { ArrowRight, Zap, Users, Target, Heart } from 'lucide-react';

export function About() {
  const t = useTranslations('about');

  const highlights = [
    { icon: Zap, label: 'Automation-first', color: 'text-accent' },
    { icon: Users, label: 'Team player', color: 'text-teal' },
    { icon: Target, label: 'Data-driven', color: 'text-accent' },
    { icon: Heart, label: 'Baraka4Gambia', color: 'text-teal' },
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Images */}
          <Reveal direction="left">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl border-2 border-dashed border-border bg-background-alt flex items-center justify-center ${
                    i === 1 ? 'rounded-br-none' : i === 2 ? 'rounded-bl-none' : i === 3 ? 'rounded-tr-none' : 'rounded-tl-none'
                  }`}
                >
                  <span className="text-foreground-subtle text-xs">Photo {i}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right - Content */}
          <div className="space-y-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider">
                <span className="w-8 h-px bg-accent" />
                {t('label')}
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                {t('title')}
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-foreground-muted leading-relaxed">{t('subtitle')}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="space-y-4 text-foreground-muted leading-relaxed">
                <p>{t('p1')}</p>
                <p>{t('p2')}</p>
                <p>{t('p3')}</p>
                <p>{t('p4')}</p>
              </div>
            </Reveal>

            <StaggerContainer className="flex flex-wrap gap-3 pt-2">
              {highlights.map(({ icon: Icon, label, color }) => (
                <StaggerItem key={label}>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-alt border border-border text-sm font-medium text-foreground">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    {label}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <Reveal delay={0.3}>
              <a
                href="mailto:samba@sambajarju.nl"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all duration-200 mt-2"
              >
                {t('cta')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
