import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        charcoal: 'var(--color-charcoal)',
        paper: 'var(--color-paper)',
        sand: 'var(--color-sand)',
        signal: 'var(--color-signal)',
        copper: 'var(--color-copper)',
        slateText: 'var(--color-slate-text)'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(0,0,0,0.18)'
      },
      borderRadius: {
        button: 'var(--button-radius)'
      }
    }
  },
  plugins: []
};

export default config;
