/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      border: ['focus'],
      colors: {
        primary: {
          background: '#212121',
          textfield: '#181818',
        },
      },
    },
  },
  plugins: [],
};
