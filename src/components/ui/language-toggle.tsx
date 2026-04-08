'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';
import { Languages, Loader2 } from 'lucide-react';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = () => {
    const newLocale = locale === 'nl' ? 'en' : 'nl';
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border border-border bg-surface hover:bg-surface-hover transition-all duration-200 text-foreground cursor-pointer disabled:opacity-50"
      aria-label={`Switch to ${locale === 'nl' ? 'English' : 'Nederlands'}`}
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
      <span className="uppercase tracking-wide text-xs">{locale === 'nl' ? 'EN' : 'NL'}</span>
    </button>
  );
}
