
// Sizes are relative to the viewport width.
// E.g.: 1 / 500 would result in a width of 2px with a 1000px viewport.
export const RELATIVE_DOT_SIZE = 1 / 500;

export const RELATIVE_YARD_STICK_STROKE_WIDTH = 1 / 1000;

export const RELATIVE_YARD_STICK_OFFSET_X = 1 / 20;
export const RELATIVE_YARD_STICK_OFFSET_Y = 1 / 30;

export const RELATIVE_YARD_STICK_LABEL_OFFSET_Y = 1 / 120;

// These colors should ideally be imported from tailwind.config.js
//
// However, the official guide (https://tailwindcss.com/docs/configuration#referencing-in-java-script)
// does not seem to work with our current setup.
//
// Reason: tailwind.config.js is a commonjs module.
// Importing it with our current build setup - as suggested in the guide above -
// will result in browser errors.
export const SEA_BLUE_500 = '#007499';
export const GRAY_700_LIGHT = '#474747';
export const GRAY_700_DARK = '#9e9e9e';
