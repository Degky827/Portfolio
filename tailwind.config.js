/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#00d4ff',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      },
      borderRadius: {
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
