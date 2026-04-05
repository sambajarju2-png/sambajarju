'use client';

import { useTranslations } from 'next-intl';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { Quote, Star } from 'lucide-react';

const testimonialKeys = ['nigel', 'keith', 'rik', 'stan'] as const;

export function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent uppercase tracking-wider">
            <span className="w-8 h-px bg-accent" />
            {t('label')}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mt-4">{t('title')}</h2>
        </Reveal>

        <StaggerContainer className="grid md:grid-cols-2 gap-6 mt-12">
          {testimonialKeys.map((key) => (
            <StaggerItem key={key}>
              <div className="rounded-2xl border border-border bg-surface p-6 lg:p-8 hover:shadow-md hover:border-border-hover transition-all duration-300 relative group h-full flex flex-col">
                <Quote className="w-8 h-8 text-accent/20 absolute top-6 right-6" />

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <blockquote className="text-foreground-muted leading-relaxed flex-1 italic">
                  &ldquo;{t(`${key}.quote`)}&rdquo;
                </blockquote>

                <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-teal/20 flex items-center justify-center text-sm font-bold text-foreground">
                    {t(`${key}.name`).charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{t(`${key}.name`)}</p>
                    <p className="text-xs text-foreground-subtle">{t(`${key}.role`)}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
