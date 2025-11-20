/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e6e8f0',
          100: '#b8bdd4',
          200: '#8a93b8',
          300: '#5c699c',
          400: '#2e3f80',
          500: '#001564', // Main navy blue
          600: '#00114f',
          700: '#000d3a',
          800: '#000925',
          900: '#000510'
        },
        purple: {
          50: '#f3e8ff',
          100: '#e1b3ff',
          200: '#cf7eff',
          300: '#bd49ff',
          400: '#ab14ff',
          500: '#6a1b9a', // Deep purple
          600: '#55157a',
          700: '#400f5a',
          800: '#2b0a3a',
          900: '#16041a'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(106, 27, 154, 0.5), 0 0 10px rgba(106, 27, 154, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(106, 27, 154, 0.8), 0 0 30px rgba(106, 27, 154, 0.5)' }
        }
      }
    },
  },
  plugins: [],
};