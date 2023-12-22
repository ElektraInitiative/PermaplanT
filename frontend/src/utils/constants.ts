// These colors should ideally be imported from tailwind.config.js
//
// However, the official guide (https://tailwindcss.com/docs/configuration#referencing-in-java-script)
// does not seem to work with our current setup.
//
// Reason: tailwind.config.js is a commonjs module.
// Importing it with our current build setup - as suggested in the guide above -
// will result in browser errors.

export const COLOR_NONE = '#00000000';
export const COLOR_PRIMARY_400 = '#6f9e48';
export const COLOR_SECONDARY_400 = '#0084ad';

export const COLOR_SEA_BLUE_500 = '#007499';
export const COLOR_GRAY_700_LIGHT = '#474747';
export const COLOR_GRAY_700_DARK = '#9e9e9e';

// Accent color used for editor objects that should be visible on most backgrounds.
export const COLOR_EDITOR_HIGH_VISIBILITY = '#ca3b3b';

export const COLOR_NO_SHADE = 'rgba(219,215,18,0.2)';
export const COLOR_LIGHT_SHADE = 'rgba(146,213,255,0.2)';
export const COLOR_PARTIAL_SHADE = 'rgba(51,76,255,0.2)';
export const COLOR_PERMANENT_SHADE = 'rgba(108,54,208,0.2)';
export const COLOR_PERMANENT_DEEP_SHADE = 'rgba(0,0,0,0.2)';
