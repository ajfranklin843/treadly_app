/** @type {const} */
const themeColors = {
  // Primary brand colors — always the same in both modes
  primary: { light: '#C9956A', dark: '#C9956A' },         // Rose gold
  primaryLight: { light: '#E8B89A', dark: '#E8B89A' },    // Rose gold light
  primaryMuted: { light: '#D4A090', dark: '#D4A090' },    // Blush deep

  // Backgrounds
  background: { light: '#FAF7F4', dark: '#0A0A0A' },      // Warm white / Deep black
  surface: { light: '#F0EBE5', dark: '#1A1A1A' },         // Elevated surface
  surfaceMid: { light: '#E8E0D8', dark: '#252525' },      // Mid surface / card

  // Text
  foreground: { light: '#1A1A1A', dark: '#FAF7F4' },      // Primary text
  muted: { light: '#7A6E68', dark: '#C8C0B8' },           // Muted / captions
  subtle: { light: '#A89E96', dark: '#6A6058' },          // Very muted

  // Borders
  border: { light: '#DDD5CC', dark: '#2E2E2E' },
  borderAccent: { light: '#C9956A', dark: '#C9956A' },    // Rose gold border

  // Semantic
  success: { light: '#4A9B6F', dark: '#5DBF8A' },
  warning: { light: '#C9956A', dark: '#E8B89A' },
  error: { light: '#C05050', dark: '#E07070' },

  // Blush tones
  blush: { light: '#F2D4C8', dark: '#3A2520' },
  blushMid: { light: '#E8C4B4', dark: '#2E1E1A' },
};

module.exports = { themeColors };
