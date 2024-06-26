/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '1023px',
        'lg': '1280px',
        'xl': '1536px',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      translate: {
        'full': '100%',
        '-full': '-100%',
        '0': '0',
      },
      transitionProperty: {
        'transform': 'transform',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'ease-in-out',
      },
      colors: {
        'custom-azul': '#003366',
        'custom-azul2': '#BEC5CB',
        'custom-naranja': '#FFA500',
      },
    },
  },
  plugins: [],
}
