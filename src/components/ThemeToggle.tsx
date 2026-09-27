import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEMES: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: 'light', label: 'Light', icon: Sun },
  { mode: 'dark', label: 'Dark', icon: Moon },
  { mode: 'system', label: 'Auto', icon: Monitor },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('qr_studio_theme') as ThemeMode) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode: ThemeMode) => {
      const isDark = mode === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : mode === 'dark';

      root.classList.toggle('dark', isDark);
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      root.style.colorScheme = isDark ? 'dark' : 'light';
    };

    applyTheme(theme);
    localStorage.setItem('qr_studio_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
    >
      {THEMES.map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          type="button"
          onClick={() => setTheme(mode)}
          title={`${label} theme`}
          aria-pressed={theme === mode}
          className={`p-1.5 rounded-lg transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
            theme === mode
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
