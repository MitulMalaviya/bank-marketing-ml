/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map "Live Green" to emerald (our primary accent color)
        emerald: {
          100: '#c2edda', // Grey Blue Green (soft accent)
          400: '#7ddfa1',
          500: '#68d388', // Live Green
          600: '#5ab876', // Hover state
          700: '#4e9f66',
        },
        // Map "Brightly Orange Number 2" to rose (our warning/alert color)
        rose: {
          400: '#fa663d',
          500: '#f43a09', // Brightly Orange Number 2
          600: '#d93106',
          700: '#b82905',
        },
        // Map "Grandpa Orange" to custom color
        grandpa: {
          500: '#ffb766',
        },
        // Map "Grey Blue Green" to custom color
        greyblue: {
          500: '#c2edda',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        navy: {
          800: '#0f172a',
          900: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
