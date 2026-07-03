/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0f172a',
        sand: '#64748b',
        aqua: '#0284c7',
        coral: '#fb7185',
      },
      fontFamily: {
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 80px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};