/**
 * THREADLY Design Tokens
 * The single source of truth for brand colors, typography, spacing, and shadows.
 */

export const ThreadlyColors = {
  // Core brand
  black: '#0A0A0A',
  charcoal: '#1A1A1A',
  charcoalMid: '#252525',
  charcoalLight: '#2E2E2E',

  // Rose gold spectrum
  roseGold: '#C9956A',
  roseGoldLight: '#E8B89A',
  roseGoldDim: '#B07A52',

  // Blush spectrum
  blush: '#F2D4C8',
  blushDeep: '#D4A090',
  blushDark: '#3A2520',

  // Neutrals
  warmWhite: '#FAF7F4',
  warmWhiteMuted: '#C8C0B8',
  warmWhiteSubtle: '#A89E96',

  // Aliases used in screens
  warmWhiteSubtle2: '#8A8078',

  // Gradients (use as LinearGradient colors)
  gradientRoseGold: ['#C9956A', '#E8B89A'] as [string, string],
  gradientDark: ['#0A0A0A', '#1A1A1A'] as [string, string],
  gradientBlush: ['#F2D4C8', '#E8B89A'] as [string, string],
  gradientHero: ['rgba(10,10,10,0)', 'rgba(10,10,10,0.85)'] as [string, string],

  // Semantic
  success: '#5DBF8A',
  error: '#E07070',
  deal: '#4A9B6F',
  dealBg: 'rgba(74,155,111,0.15)',
} as const;

export const ThreadlySpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
  screenPadding: 20,
} as const;

export const ThreadlyRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  pill: 100,
} as const;

export const ThreadlyShadow = {
  // Soft glow for rose gold elements
  roseGlow: {
    shadowColor: '#C9956A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  // Standard card shadow
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  // Subtle lift
  lift: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

export const ThreadlyFonts = {
  // Serif display — hero headlines
  displaySerif: 'Georgia',
  // Clean sans — body, UI labels
  sans: 'System',
} as const;
