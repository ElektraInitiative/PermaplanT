# 2D Drawing Library

## Problem

The Permaplant app needs a 2D graphics library to build one of its core features using the canvas.

## Constraints

- The library must provide an easy-to-use API for creating and manipulating canvas elements.
- The library should be well-supported and have a strong community.

## Assumptions

## Considered Alternatives

- HTML5 canvas API: The HTML5 canvas API is a widely-supported and well-documented option for creating and manipulating 2D graphics in a web page. However, it provides a low-level API that may require more work to use than some of the other options.
- Raphaël: Raphaël is a JavaScript library that provides a simple API for creating and manipulating SVG graphics. However, it may not be as well-suited for creating canvas-based graphics as some of the other options.
- Pixi.js: Pixi.js is a 2D graphics library that is designed for creating fast, interactive graphics for games and other applications. However, it relies on WebGL for rendering.

## Decision

We will use Konva as the 2D graphics library for the Permaplant app.

Konva is a well-supported and widely-used 2D graphics library. It has support for a wide range of features, including drawing shapes, text, and images, as well as transformations and animations. It is built on top of the HTML Canvas API and provides a higher-level, more declarative interface for creating and manipulating canvas elements.

## Rationale

## Implications

## Related Decisions

## Notes
