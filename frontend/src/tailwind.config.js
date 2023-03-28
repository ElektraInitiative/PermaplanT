const colors = require('tailwindcss/colors')
const gray = {
  '50': {
    light: '#fefefe',
    DEFAULT: '#fefefe',
    dark: '#181818'
  },
  '100': {
    light: '#fafafa',
    DEFAULT: '#fefefe',
    dark: '#212121'
  },
  '200': {
    light: '#eeeeee',
    DEFAULT: '#eeeeee',
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
}

const brown = {
  '100': {
    light: "#E5E2E0",
    DEFAULT: "#E5E2E0",
    dark: "#1F1C19",
  },
  '200': {
    light: "#D8D4D1",
    DEFAULT: "#D8D4D1",
    dark: "#443D37",
  },
  '300': {
    light: "#BEB7B2",
    DEFAULT: "#BEB7B2",
    dark: "#695E55",
  },
  '400': {
    light: "#AAA19A",
    DEFAULT: "#AAA19A",
    dark: "#83766C",
  },
  '500': {
    light: "#968C83",
    DEFAULT: "#968C83",
    dark: "#968C83",
  },
  '600': {
    light: "#83766C",
    DEFAULT: "#83766C",
    dark: "#AAA19A",
  },
  '700': {
    light: "#695E55",
    DEFAULT: "#695E55",
    dark: "#BEB7B2",
  },
  '800': {
    light: "#443D37",
    DEFAULT: "#443D37",
    dark: "#D8D4D1",
  },
  '900': {
    light: "#1F1C19",
    DEFAULT: "#1F1C19",
    dark: "#E5E2E0"
  },
}

const blue = {
  '900': "#001f23",
  '800': "#004249",
  '700': "#005b65",
  '600': "#006973",
  '500': "#008491",
  '400': "#00a0af",
  '300': "#22bcce",
  '200': "#4fd8ea",
  '100': "#94f1ff",
}

const green = {
  '900': "#1d1d00",
  '800': "#3e3e00",
  '700': "#4a4900",
  '600': "#626200",
  '500': "#969518",
  '400': "#b1b034",
  '300': "#cdcc4e",
  '200': "#eae867",
  '100': "#fffdbd",
}

const yellow = {
  '900': '#281900',
  '800': '#513600',
  '700': '#6f4c00',
  '600': '#9f6e00',
  '500': '#dfa028',
  '400': '#feba43',
  '300': '#ffdead',
  '200': '#ffeeda',
  '100': '#fffbff',
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      border: ['focus'],
      colors: {
        // variant 1
        // background: brown,
        // primary: colors.emerald,
        // secondary: blue,
        // neutral: brown,

        // variant 2
        // background: gray,
        // primary: colors.emerald,
        // secondary: blue,
        // neutral: gray,

        // variant 3
        // background: brown,
        // primary: green,
        // secondary: yellow,
        // neutral: brown,

        // variant 4
        background: gray,
        primary: green,
        secondary: yellow,
        neutral: gray,
      },
    },
  },
  plugins: [],
};
