/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: '#0B0E17',
          800: '#131929',
          700: '#1E273D',
          600: '#2A3654',
          accent: '#7B2CBF',
          cyan: '#00F5D4',
          purple: '#9D4EDD',
          glow: '#C77DFF',
        },
      },
    },
  },
  plugins: [],
};
