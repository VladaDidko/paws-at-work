/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Adyen green brand palette
        brand: {
          50: '#e9fbf0',
          100: '#c9f5da',
          200: '#95ebb8',
          300: '#5bdd92',
          400: '#28cd6e',
          500: '#0abf53',
          600: '#06a847',
          700: '#07863a',
          800: '#0a6a30',
          900: '#0b5228',
        },
        // Adyen ink — near-black green used for dark surfaces
        ink: {
          700: '#0d2b1c',
          800: '#0a1f15',
          900: '#06140d',
        },
        sand: {
          50: '#f5f8f6',
          100: '#eaf0ec',
          200: '#d8e2dc',
        },
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(10, 191, 83, 0.28)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
