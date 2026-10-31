/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E8',
          200: '#F5E6C7',
          300: '#E8CA7A',
          400: '#DFB748',
          500: '#D4AF37', // Solid Rich Gold Master
          600: '#BF9B2E',
          700: '#A68522',
          800: '#856A18',
          900: '#5E4A0E',
        },
        dark: {
          950: '#070709', // Deepest black
          900: '#0d0d11', // Main background
          850: '#141419', // Card background
          800: '#1c1c23', // Elevated surface
          750: '#25252e', // Input surface
          700: '#2e2e3a',
        }
      },
      backgroundImage: {
        // Solid gold styling instead of bright shiny gradients
        'gold-gradient': 'linear-gradient(to right, #D4AF37, #D4AF37)',
        'gold-solid': 'linear-gradient(to right, #D4AF37, #D4AF37)',
      },
      boxShadow: {
        'gold-sm': 'none',
        'gold-glow': 'none',
      }
    },
  },
  plugins: [],
}
