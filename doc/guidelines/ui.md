# UI

## Submitting Data

Data should always be submitted on-the-fly with debouncing.

## Okay Buttons

If needed, the confirming button should be on the left.

## Gender

Use plural to avoid gender, i.e. use "we" or "they", avoid "he"/"she".

## Error Handling

- All errors should be shown via toastify on the top right (no modals).
- Say "Sorry," in the beginning of an error.
- They should be personified, i.e., start with "I"
- Only give suggestions how to solve the problem if you are relatively sure what the problem is, but even then say "probably".
- give context
- avoid technical terms
- use colors/formatting etc. to highlight important passages

E.g.:

"Sorry, I **cannot communicate** with my server, there is probably some network problem or the server is down. _Please retry later._"

## Accessibility

- don't use title attribute, see https://inclusive-components.design/tooltips-toggletips/

## Raster

We raster per pixel, which should represent 1cm in reality.
Geometric operations that produce results not in that raster, should be rounded to the nearest whole value.
Only integer values should be used to store distances in frontend-state or in the backend.

## Key bindings

A JSON file is responsible for global key bindings.

## Colors

We use a uniform color theme for everything related to the UI.
The colors are stored within the Tailwind CSS color definitions `primary`, `secondary` and `neutral`.
As stated in [Googles Material Design Guidelines](https://m3.material.io/styles/color/the-color-system/key-colors-tones), `primary` is to be used for key UI components, `secondary` for additional color expression and `neutral` for backgrounds and surfaces.
They can be accessed like any other defined color in Tailwind CSS and can be appended with a number denoting the shade to be used.

Following shade suggestions should be used as a starting point for coloring new UI components:
| **location** | **light mode** | **dark mode** |
| :------------------ | :------------- | :------------ |
| main color | 500 | 300 |
| text on main | 50 | 700 |
| alternative color | 200 | 600 |
| text on alternative | 800 | 200 |

## Icons

We use https://tablericons.com

Already in use:

- eraser (delete)
- trash (remove plant, see glossary)
- tags (show labels of active layer)
- grid-dots

later:

- settings
- menu-2
- download
- upload
- ruler-3
- cut
- copy
- versions
- search
- zoom-filled
- square-plus
- square-arrow-up
- quare-arrow-down
