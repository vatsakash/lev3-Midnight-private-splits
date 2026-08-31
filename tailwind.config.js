/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        midnight: {
          950: '#060911',
          900: '#090D16',
          800: '#10172A',
          700: '#1A233D',
          600: '#253256',
          indigo: '#4F46E5',
          accent: '#6366F1',
          cyan: '#06B6D4',
          cyanGlow: '#22D3EE',
          purple: '#8B5CF6',
          glow: '#818CF8',
        },
      },
    },
  },
  plugins: [],
};
