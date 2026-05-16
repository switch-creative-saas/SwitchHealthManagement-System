/**
 * VitaLink Enterprise Design Tokens
 * Centralized design system with semantic color palette, typography, spacing, and animations
 */

// Color Palette - VitaLink Brand Identity
export const colors = {
  // Primary Teal - Core brand color
  teal: {
    50: '#F0F9FB',
    100: '#E0F2F7',
    200: '#B3DFE9',
    300: '#80CADC',
    400: '#4DB5CE',
    500: '#17A2B8', // Primary
    600: '#0D8FA8',
    700: '#0A7A93',
    800: '#08667F',
    900: '#065270',
    950: '#043B54',
  },
  
  // Secondary Cyan - Accent and highlights
  cyan: {
    50: '#F0FCFD',
    100: '#E0F9FB',
    200: '#B3F0F6',
    300: '#80E7F2',
    400: '#4DDEEE',
    500: '#1DD1E1', // Medical Cyan
    600: '#16B7C9',
    700: '#119DB3',
    800: '#0D839D',
    900: '#096987',
    950: '#055470',
  },
  
  // Tertiary Orange - Action and alerts
  orange: {
    50: '#FEF7F0',
    100: '#FDEEE0',
    200: '#FBDCC0',
    300: '#F8C4A0',
    400: '#F5A860',
    500: '#FF8C42', // Warm Orange
    600: '#E87B2D',
    700: '#D16A1A',
    800: '#B85B14',
    900: '#9F4C0F',
    950: '#7F3D0A',
  },
  
  // Neutrals - Grayscale for text and backgrounds
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Medical/Clinical Colors
  outbreak: '#DC2626', // Red for outbreak indicators
  endemic: '#F59E0B', // Orange for endemic diseases
  controlled: '#10B981', // Green for controlled diseases
  monitoring: '#06B6D4', // Cyan for monitoring status
};

// Typography System
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Courier, monospace',
  },
  
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.75,
  },
  
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Spacing System (8px base)
export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
};

// Shadows - Healthcare professional aesthetic
export const shadows = {
  // Subtle elevation
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  
  // Glow effects for branding
  glow_teal: '0 0 20px rgba(23, 162, 184, 0.3)',
  glow_cyan: '0 0 20px rgba(29, 209, 225, 0.3)',
  glow_orange: '0 0 20px rgba(255, 140, 66, 0.3)',
  
  // Glass morphism effects
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.375rem', // 6px
  base: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  full: '9999px',
  
  // Custom for components
  button: '0.75rem', // 12px
  card: '1rem', // 16px
  modal: '1rem', // 16px
  input: '0.75rem', // 12px
};

// Animation & Transitions
export const animations = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// Component-specific tokens
export const components = {
  button: {
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,
      md: `${spacing[3]} ${spacing[4]}`,
      lg: `${spacing[4]} ${spacing[6]}`,
    },
    fontSize: {
      sm: typography.fontSize.sm,
      md: typography.fontSize.base,
      lg: typography.fontSize.lg,
    },
  },
  
  input: {
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.base,
    height: '2.5rem', // 40px
  },
  
  card: {
    padding: spacing[6],
    gap: spacing[4],
  },
};

// Export theme preset for light and dark modes
export const themeTokens = {
  light: {
    background: colors.gray[50],
    foreground: colors.gray[900],
    card: colors.gray[100],
    cardForeground: colors.gray[900],
    primary: colors.teal[500],
    primaryForeground: colors.gray[50],
    secondary: colors.cyan[500],
    secondaryForeground: colors.gray[50],
    accent: colors.orange[500],
    accentForeground: colors.gray[900],
    destructive: colors.error,
    destructiveForeground: colors.gray[50],
    border: colors.gray[200],
    input: colors.gray[100],
    ring: colors.teal[500],
    muted: colors.gray[200],
    mutedForeground: colors.gray[600],
  },
  
  dark: {
    background: colors.gray[950],
    foreground: colors.gray[50],
    card: colors.gray[900],
    cardForeground: colors.gray[50],
    primary: colors.teal[400],
    primaryForeground: colors.gray[950],
    secondary: colors.cyan[400],
    secondaryForeground: colors.gray[950],
    accent: colors.orange[400],
    accentForeground: colors.gray[950],
    destructive: colors.error,
    destructiveForeground: colors.gray[50],
    border: colors.gray[800],
    input: colors.gray[800],
    ring: colors.teal[400],
    muted: colors.gray[700],
    mutedForeground: colors.gray[400],
  },
};
