import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./pages/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
      colors: { bg: '#07070a', surface: '#0d0d14', card: '#12121a' },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
};
export default config;
