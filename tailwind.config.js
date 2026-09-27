const { hairlineWidth } = require('nativewind/theme');

/** A colour token backed by an HSL-channel CSS variable in src/global.css. */
const token = (name) => `hsl(var(--${name}))`;

/**
 * Denly theme (plan 0003 §2, ADR 0009). Colours are roles, never hex: add a token to
 * src/global.css and src/lib/theme.ts first. Type sizes follow the iOS text styles; the display
 * face (Bricolage Grotesque) is for large titles, section heads and the hero only.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        background: token('background'),
        foreground: token('foreground'),
        primary: { DEFAULT: token('primary'), foreground: token('primary-foreground') },
        secondary: { DEFAULT: token('secondary'), foreground: token('secondary-foreground') },
        destructive: { DEFAULT: token('destructive'), foreground: token('destructive-foreground') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('accent-foreground') },
        popover: { DEFAULT: token('popover'), foreground: token('popover-foreground') },
        card: { DEFAULT: token('card'), foreground: token('card-foreground') },
        // Denly extras — each has one job (plan 0003 §2).
        hero: { DEFAULT: token('hero'), foreground: token('hero-foreground') },
        camera: { DEFAULT: token('camera'), foreground: token('camera-foreground') },
        detected: { DEFAULT: token('detected'), soft: token('detected-soft') },
        likely: token('likely'),
        info: { DEFAULT: token('info'), soft: token('info-soft') },
        dish: { DEFAULT: token('dish'), soft: token('dish-soft') },
        leafy: { DEFAULT: token('leafy'), soft: token('leafy-soft') },
        fish: { DEFAULT: token('fish'), soft: token('fish-soft') },
      },
      fontFamily: {
        display: ['BricolageGrotesque_700Bold'],
        'display-medium': ['BricolageGrotesque_500Medium'],
      },
      fontSize: {
        'large-title': ['34px', { lineHeight: '38px' }],
        'title-1': ['28px', { lineHeight: '32px' }],
        'title-2': ['22px', { lineHeight: '28px' }],
        'title-3': ['20px', { lineHeight: '26px' }],
        body: ['17px', { lineHeight: '24px' }],
        callout: ['16px', { lineHeight: '22px' }],
        subhead: ['15px', { lineHeight: '21px' }],
        footnote: ['13px', { lineHeight: '18px' }],
        caption: ['12px', { lineHeight: '16px' }],
        'caption-2': ['11px', { lineHeight: '13px' }],
      },
      spacing: {
        13: '3.25rem', // 52pt: primary button / input height
        15: '3.75rem', // 60pt: list row min height
      },
      borderRadius: {
        lg: 'var(--radius)', // 12pt rows, cards, inputs
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)', // 8pt chips, badges
        tile: '10px',
        sheet: '16px',
        hero: '20px',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
