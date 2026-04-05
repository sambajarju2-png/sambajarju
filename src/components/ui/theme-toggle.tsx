'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  const modes = [
    { value: 'light', icon: Sun },
    { value: 'dark', icon: Moon },
    { value: 'system', icon: Monitor },
  ] as const;

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-background-alt p-1 border border-border">
      {modes.map(({ value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            relative rounded-full p-1.5 transition-all duration-200
            ${theme === value
              ? 'bg-surface text-accent shadow-sm'
              : 'text-foreground-subtle hover:text-foreground-muted'
            }
          `}
          aria-label={`Switch to ${value} theme`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
