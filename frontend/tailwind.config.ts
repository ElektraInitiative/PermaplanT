import type { Config } from 'tailwindcss';

const gray = {
  50: {
    light: '#fefefe',
    DEFAULT: '#fefefe',
    dark: '#181818',
  },
  100: {
    light: '#fafafa',
    DEFAULT: '#fefefe',
    dark: '#212121',
  },
  200: {
    light: '#eeeeee',
    DEFAULT: '#eeeeee',
    dark: '#333333',
  },
  300: {
    light: '#bdbdbd',
    DEFAULT: '#bdbdbd',
    dark: '#474747',
  },
  400: {
    light: '#9e9e9e',
    DEFAULT: '#9e9e9e',
    dark: '#5c5c5c',
  },
  500: {
    light: '#808080',
    DEFAULT: '#808080',
    dark: '#717171',
  },
  600: {
    light: '#636363',
    DEFAULT: '#636363',
    dark: '#878787',
  },
  700: {
    light: '#474747',
    DEFAULT: '#474747',
    dark: '#9e9e9e',
  },
  800: {
    light: '#2d2d2d',
    DEFAULT: '#2d2d2d',
    dark: '#b5b5b5',
  },
  900: {
    light: '#161616',
    DEFAULT: '#161616',
    dark: '#cdcdcd',
  },
};

// Accent color used for editor objects that should be visible on most backgrounds.
const highlight = {
  DEFAULT: '#ca3b3b',
};

/*
 * Definitions for accent colors used by frontend themes.
 * Each color comes in 10 shades that can be addressed by their respective number.
 * Recommended shade usage:
 *   - base color: 500 (light), 300 (dark)
 *   - on base: 50 (light), 700 (dark)
 *   - alternative: 200 (light), 600 (dark)
 *   - on alternative: 800/900 (light), 200 (dark)
 */
const accentColors = {
  asparagus: {
    50: '#ffffff',
    100: '#efffda',
    200: '#bef291',
    300: '#a3d578',
    400: '#6f9e48',
    500: '#3e6919',
    600: '#285000',
    700: '#193700',
    800: '#0c2000',
    900: '#0c2000',
  },
  rackley: {
    50: '#ffffff',
    100: '#f8f9ff',
    200: '#b9c6d6',
    300: '#90a6be',
    400: '#4f95d9',
    500: '#587597',
    600: '#4d6683',
    700: '#35465a',
    800: '#293746',
    900: '#293746',
  },
  emerald: {
    50: '#ffffff',
    100: '#e8ffef',
    200: '#6ffbbe',
    300: '#4edea3',
    400: '#00a572',
    500: '#006c49',
    600: '#005236',
    700: '#003824',
    800: '#002113',
    900: '#002113',
  },
  bondi: {
    50: '#ffffff',
    100: '#f0fbff',
    200: '#a9edff',
    300: '#35d8f8',
    400: '#009fb8',
    500: '#006879',
    600: '#004e5c',
    700: '#003640',
    800: '#001f26',
    900: '#001f26',
  },
  sea_blue: {
    50: '#ffffff',
    100: '#8fe4ff',
    200: '#00b2eb',
    300: '#0093c2',
    400: '#0084ad',
    500: '#007499',
    600: '#005570',
    700: '#003647',
    800: '#002733',
    900: '#00171f',
  },
};

export default {
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
        secondary: accentColors.sea_blue,
        neutral: gray,
        highlight: highlight,
      },
    },
  },
  plugins: [],
} satisfies Config;
