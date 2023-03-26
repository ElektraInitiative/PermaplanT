const colors = require('tailwindcss/colors')

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
            DEFAULT: '#dddddd',
            dark: '#333333'
          },
          '300': {
            light: '#bdbdbd',
            DEFAULT: '#bdbdbd',
            dark: '#474747'
          },
          '400': {
            light: '#9e9e9e',
            DEFAULT: '#9e9e9e',
            dark: '#5c5c5c'
          },
          '500': {
            light: '#808080',
            DEFAULT: '#808080',
            dark: '#717171'
          },
          '600': {
            light: '#636363',
            DEFAULT: '#636363',
            dark: '#878787'
          },
          '700': {
            light: '#474747',
            DEFAULT: '#474747',
            dark: '#9e9e9e'
          },
          '800': {
            light: '#2d2d2d',
            DEFAULT: '#2d2d2d',
            dark: '#b5b5b5'
          },
          '900': {
            light: '#161616',
            DEFAULT: '#161616',
            dark: '#cdcdcd'
          },
        },
        primary: colors.emerald,
        secondary: colors.amber,
        neutral: colors.gray,
      },
    },
  },
  plugins: [],
};
