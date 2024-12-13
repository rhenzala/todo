/** @type {import('tailwindcss').Config} */
module.exports = {
 
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#f9fafb',
      'black': '#030712',
      'gray': '#e5e5e5',
      'red': '#dc2626',
      'amber': '#f59e0b',
      'green': '#22c55e',
    },

    extend: {
      screens: {
        'custom-sm': { max: '762px' }, 
      },
    },  
  },
  plugins: [],
}

