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
    '50': '#ffffff',
    '100': '#efffda',
    '200': '#bef291',
    '300': '#a3d578',
    '400': '#6f9e48',
    '500': '#3e6919',
    '600': '#285000',
    '700': '#193700',
    '800': '#0c2000',
    '900': '#0c2000'
  },
  rackley: {
    '50': '#ffffff',
    '100': '#f8f9ff',
    '200': '#b9c6d6',
    '300': '#90a6be',
    '400': '#4f95d9',
    '500': '#587597',
    '600': '#4d6683',
    '700': '#35465a',
    '800': '#293746',
    '900': '#293746'
  },
  emerald: {
    '50': '#ffffff',
    '100': '#e8ffef',
    '200': '#6ffbbe',
    '300': '#4edea3',
    '400': '#00a572',
    '500': '#006c49',
    '600': '#005236',
    '700': '#003824',
    '800': '#002113',
    '900': '#002113'
  },
  bondi: {
    '50': '#ffffff',
    '100': '#f0fbff',
    '200': '#a9edff',
    '300': '#35d8f8',
    '400': '#009fb8',
    '500': '#006879',
    '600': '#004e5c',
    '700': '#003640',
    '800': '#001f26',
    '900': '#001f26'
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
