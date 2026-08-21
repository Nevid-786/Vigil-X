/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        emergency: {
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
      },
      boxShadow: {
        premium: '0 10px 30px -5px rgba(99, 102, 241, 0.08), 0 4px 15px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 20px 40px -10px rgba(99, 102, 241, 0.15), 0 10px 20px rgba(0, 0, 0, 0.06)',
        'emergency-glow': '0 0 30px rgba(244, 63, 94, 0.4)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glowPulse 1.8s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)', borderColor: '#f43f5e' },
          '50%': { boxShadow: '0 0 40px rgba(244, 63, 94, 0.85)', borderColor: '#fb7185' },
        },
      },
    },
  },
  plugins: [],
};
