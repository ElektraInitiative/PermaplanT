/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      border: ['focus'],
      colors: {
        background: {
          '100': {
            light: '#fefefe',
            DEFAULT: '#fefefe',
            dark: '#212121'
          },
          '200': {
            light: '#dddddd',
            DEFAULT: '#fefefe',
            dark: '#333333'
          },
          '300': {
            light: '#bdbdbd',
            DEFAULT: '#fefefe',
            dark: '#474747'
          },
          '400': {
            light: '#9e9e9e',
            DEFAULT: '#fefefe',
            dark: '#5c5c5c'
          },
          '500': {
            light: '#808080',
            DEFAULT: '#fefefe',
            dark: '#717171'
          },
          '600': {
            light: '#636363',
            DEFAULT: '#fefefe',
            dark: '#878787'
          },
          '700': {
            light: '#474747',
            DEFAULT: '#fefefe',
            dark: '#9e9e9e'
          },
          '800': {
            light: '#2d2d2d',
            DEFAULT: '#fefefe',
            dark: '#b5b5b5'
          },
          '900': {
            light: '#161616',
            DEFAULT: '#fefefe',
            dark: '#cdcdcd'
          },
        },
        primary: {
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
