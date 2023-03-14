/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      border: ['focus'],
      colors: {
        primary: {
          background: '#fefefe',
          textfield: '#181818',
          button: '#181818',
        },
      },
    },
  },
  plugins: [],
};
