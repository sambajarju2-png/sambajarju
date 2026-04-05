'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqKeys = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight text-center">{t('title')}</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 space-y-3">
            {faqKeys.map((num) => {
              const isOpen = openIndex === num;
              return (
                <div
                  key={num}
                  className={`rounded-xl border transition-all duration-200 ${
                    isOpen ? 'border-accent/30 bg-surface shadow-sm' : 'border-border bg-surface hover:border-border-hover'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : num)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-foreground text-sm lg:text-base pr-4">{t(`q${num}`)}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-accent' : 'text-foreground-subtle'}`} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-foreground-muted leading-relaxed text-sm">
                          {t(`a${num}`)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
