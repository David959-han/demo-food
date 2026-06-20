export const colors = {
  bg: {
    base:     '#0A0B0E',
    surface:  '#111318',
    elevated: '#1A1D26',
    subtle:   '#222632',
  },
  border: {
    default: '#2A2D3A',
    subtle:  '#1E2130',
    strong:  '#3D4255',
  },
  text: {
    primary:   '#F1F3F9',
    secondary: '#8B92A5',
    muted:     '#555B6E',
    disabled:  '#3A3F52',
  },
  brand: {
    400: '#FB923C',
    500: '#F97316',
    600: '#EA6C0D',
    bg:  '#2E1A0A',
  },
  success: {
    400: '#34D399',
    500: '#10B981',
    bg:  '#0A2E22',
  },
  danger: {
    400: '#F87171',
    500: '#EF4444',
    bg:  '#2E0A0A',
  },
  warning: {
    400: '#FBBF24',
    500: '#F59E0B',
    bg:  '#2E1E04',
  },
  info: {
    400: '#60A5FA',
    500: '#3B82F6',
    bg:  '#0A1A2E',
  },
} as const;

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const radius = {
  xs:   2,
  sm:   6,
  md:   8,
  lg:   12,
  xl:   16,
  full: 9999,
} as const;

export const typography = {
  fontSans: 'Inter, system-ui, -apple-system, sans-serif',
  fontMono: 'JetBrains Mono, Menlo, monospace',
  scale: {
    xs:  '0.75rem',
    sm:  '0.875rem',
    md:  '1rem',
    lg:  '1.125rem',
    xl:  '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
} as const;

export type ColorToken = typeof colors;
export type SpacingToken = typeof spacing;
