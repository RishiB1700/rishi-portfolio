/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          lavender: '#E6E6FA',
          blush: '#FFE4E1',
          cream: '#F5F5DC',
          sage: '#C9D4C5',
          navy: '#9BB5D6'
        }
      },
      fontFamily: {
        'marcellus': ['Marcellus', 'serif'],
        'inter': ['Inter', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 20px rgba(230, 230, 250, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(230, 230, 250, 0.6)' },
        },
      }
    },
  },
  plugins: [],
}