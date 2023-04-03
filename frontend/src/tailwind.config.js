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

/*
* Example color roles for light/dark mode:
*
* 500/100: main color (e.g. buttons)
* 50/800: on main color (e.g. text on buttons)
* 100/500: supporting main color
* 800/50: on supporting main color
*/
const accentColors = {
  asparagus: {
    '50': '#f2f6ef',
    '100': '#d8e3cf',
    '200': '#bfd0af',
    '300': '#a5bd8e',
    '400': '#8baa6e',
    '500': '#719155',
    '600': '#587142',
    '700': '#3f502f',
    '800': '#26301c',
    '900': '#0d1009'
  },
  rackley: {
    '50': '#eff2f6',
    '100': '#cfd8e3',
    '200': '#afbfd0',
    '300': '#8ea5bd',
    '400': '#6e8baa',
    '500': '#557191',
    '600': '#425871',
    '700': '#2f3f50',
    '800': '#1c2630',
    '900': '#090d10'
  },
  emerald: {
    '50': '#ecfdf5',
    '100': '#d1fae5',
    '200': '#a7f3d0',
    '300': '#6ee7b7',
    '400': '#34d399',
    '500': '#10b981',
    '600': '#059669',
    '700': '#047857',
    '800': '#065f46',
    '900': '#064e3b'
  },
  bondi: {
    '50': '#e5fcff',
    '100': '#b3f5ff',
    '200': '#80eeff',
    '300': '#4de7ff',
    '400': '#1ae0ff',
    '500': '#00c7e6',
    '600': '#009bb3',
    '700': '#006e80',
    '800': '#00424d',
    '900': '#00161a'
  }
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
        // primary: accentColors.emerald,
        // secondary: accentColors.bondi,
        // neutral: gray,

        // variant 2
        primary: accentColors.asparagus,
        secondary: accentColors.rackley,
        neutral: gray,
      },
    },
  },
  plugins: [],
};
