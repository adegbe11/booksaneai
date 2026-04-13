import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        book: ['var(--font-garamond)', 'Georgia', 'serif'],
      },
      colors: {
        void: '#0A0910',
        paper: '#F5F0E8',
        ink: '#1C1A2E',
        accent: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          dark: '#5B21B6',
        },
        gold: '#D4A853',
        surface: {
          dark: '#13111F',
          '2': '#1E1B2E',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aurora': 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.10) 0%, transparent 60%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'page-turn': 'pageTurn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pageTurn: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-180deg)' },
        },
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [],
};

export default config;
