/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'oswald': ['var(--font-oswald)', 'Oswald', 'sans-serif'],
        'roboto': ['var(--font-roboto)', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 