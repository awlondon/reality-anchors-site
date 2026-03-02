import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#070b12',
        'bg-2':   '#0d1520',
        card:     '#111d2c',
        line:     '#1e3048',
        txt:      '#e4edf8',
        muted:    '#8aa8c8',
        accent:   '#2e7deb',
        'accent-2': '#6fb0ff',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
