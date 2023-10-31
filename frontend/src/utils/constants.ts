// These colors should ideally be imported from tailwind.config.js
//
// However, the official guide (https://tailwindcss.com/docs/configuration#referencing-in-java-script)
// does not seem to work with our current setup.
//
// Reason: tailwind.config.js is a commonjs module.
// Importing it with our current build setup - as suggested in the guide above -
// will result in browser errors.

export const COLOR_PRIMARY_400 = '#6f9e48';
export const COLOR_SECONDARY_400 = '#0084ad';

export const COLOR_SEA_BLUE_500 = '#007499';
export const COLOR_GRAY_700_LIGHT = '#474747';
export const COLOR_GRAY_700_DARK = '#9e9e9e';
