const { themeColors } = require("./theme.config");
const plugin = require("tailwindcss/plugin");

const tailwindColors = Object.fromEntries(
  Object.entries(themeColors).map(([name, swatch]) => [
    name,
    {
      DEFAULT: `var(--color-${name})`,
      light: swatch.light,
      dark: swatch.dark,
    },
  ]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "./lib/**/*.{js,ts,tsx}",
    "./hooks/**/*.{js,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ...tailwindColors,
        // Threadly brand shortcuts
        'threadly-black': '#0A0A0A',
        'threadly-charcoal': '#1A1A1A',
        'threadly-charcoal-mid': '#252525',
        'threadly-rose': '#C9956A',
        'threadly-rose-light': '#E8B89A',
        'threadly-blush': '#F2D4C8',
        'threadly-blush-deep': '#D4A090',
        'threadly-warm-white': '#FAF7F4',
        'threadly-warm-muted': '#C8C0B8',
      },
      fontFamily: {
        serif: ['Cormorant_Garamond', 'serif'],
        display: ['Playfair_Display', 'serif'],
        sans: ['DM_Sans', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'pill': '100px',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ':root:not([data-theme="dark"]) &');
      addVariant("dark", ':root[data-theme="dark"] &');
    }),
  ],
};
