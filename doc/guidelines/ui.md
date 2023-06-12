# UI

## Submitting Data

Data should be always submitted on-the-fly but with debouncing.

## Okay Buttons

If needed, the confirming button should be on the left.

## Gender

Use plural to avoid gender, avoid he/she.

## Raster

We raster per pixel, which should represent 1cm in reality.
Geometric operations that produce results not in that raster, should be rounded.
In the state or in the backend only integer values should be used.

## Key bindings

A JSON file is responsible for global key bindings.

## Colors

We use an uniform color theme for everything related to the UI.
The colors are stored within the Tailwind CSS color definitions `primary`, `secondary` and `neutral`.
As stated in [Googles Material Design Guidelines](https://m3.material.io/styles/color/the-color-system/key-colors-tones), `primary` is to be used for key UI components, `secondary` for additional color expression and `neutral` for backgrounds and surfaces.
They can be accessed like any other defined color in Tailwind CSS and can be appended with a number denoting the shade to be used.

Following shade suggestions should be used as a starting point for coloring new UI components:
| **location**        | **light mode** | **dark mode** |
| :------------------ | :------------- | :------------ |
| main color          | 500            | 300           |
| text on main        | 50             | 700           |
| alternative color   | 200            | 600           |
| text on alternative | 800            | 200           |
