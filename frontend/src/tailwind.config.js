/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      border: ['focus'],
      colors: {
        primary: {
          background: {
            light: '#fefefe',
            DEFAULT: '#fefefe',
            dark: '#212121'
          },
          textfield: {
            light: '#fefefe',
            DEFAULT: '#fefefe',
            dark: '#181818'
          },
          button: {
            light: '#fefefe',
            DEFAULT: '#fefefe',
            dark: '#181818'
          },
        },
      },
    },
  },
  plugins: [],
};
