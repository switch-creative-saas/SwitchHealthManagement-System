import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vitalink-theme') as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  // Update effective theme based on system preference
  useEffect(() => {
    const updateEffectiveTheme = () => {
      let effective: 'light' | 'dark' = 'light';
      
      if (theme === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          effective = 'dark';
        }
      } else {
        effective = theme;
      }
      
      setEffectiveTheme(effective);
      
      // Update HTML class
      const html = document.documentElement;
      html.classList.remove('light', 'dark');
      html.classList.add(effective);
      if (effective === 'dark') {
        html.classList.add('dark-theme');
      } else {
        html.classList.remove('dark-theme');
      }
    };

    updateEffectiveTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => updateEffectiveTheme();
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('vitalink-theme', newTheme);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
