/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#159B79',     // Primary Emerald Green
          'primary-hover': '#118265',
          'primary-light': '#DDF3E8', // Mint Green
          navy: '#062D32',        // Deep Navy
          'navy-light': '#0B434A',
          bg: '#F8F8F2',          // Clean warm cream / subtle light background
          text: '#102A32',        // Primary Text
          muted: '#71817F',       // Secondary Text
          border: '#E3E9E5',      // Harmonious light border
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(6, 45, 50, 0.05), 0 1px 2px -1px rgba(6, 45, 50, 0.05)',
        'card': '0 4px 20px -2px rgba(6, 45, 50, 0.06), 0 2px 6px -1px rgba(6, 45, 50, 0.03)',
        'card-hover': '0 12px 28px -4px rgba(6, 45, 50, 0.12), 0 4px 10px -2px rgba(6, 45, 50, 0.05)',
        'glow': '0 0 20px rgba(21, 155, 121, 0.25)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
