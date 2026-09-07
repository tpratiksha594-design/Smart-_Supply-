/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aurora: {
          bg: '#F0F4FF',
          card: 'rgba(255, 255, 255, 0.85)',
          indigo: '#4F46E5',
          violet: '#7C3AED',
          cyan: '#0891B2',
          teal: '#0D9488',
          rose: '#E11D48',
          emerald: '#059669',
          amber: '#D97706',
          text: '#0F172A',
          muted: '#475569',
        },
        indigo: {
          DEFAULT: '#4F46E5',
          glow: 'rgba(79, 70, 229, 0.25)',
        },
        cyan: {
          DEFAULT: '#0891B2',
          glow: 'rgba(8, 145, 178, 0.25)',
        },
        emerald: {
          DEFAULT: '#059669',
        },
        rose: {
          DEFAULT: '#E11D48',
        },
        slate: {
          bg: '#F0F4FF',
          card: '#FFFFFF',
          text: '#0F172A',
          muted: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'aurora-card': '0 10px 30px -5px rgba(79, 70, 229, 0.1), 0 4px 12px -2px rgba(8, 145, 178, 0.08)',
        'aurora-hover': '0 20px 40px -5px rgba(79, 70, 229, 0.2), 0 8px 25px -4px rgba(8, 145, 178, 0.18)',
        'glow-indigo': '0 0 25px rgba(79, 70, 229, 0.35)',
        'glow-cyan': '0 0 25px rgba(8, 145, 178, 0.35)',
        'glow-rose': '0 0 25px rgba(225, 29, 72, 0.35)',
      },
      backgroundImage: {
        'aurora-spectrum': 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 35%, #F5F3FF 65%, #ECFDF5 100%)',
        'aurora-card-bg': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 243, 255, 0.85) 100%)',
        'gradient-aurora-text': 'linear-gradient(135deg, #4F46E5 0%, #0891B2 50%, #059669 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
