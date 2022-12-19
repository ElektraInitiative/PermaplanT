# 2D Drawing Library

## Problem

The Permaplant app needs a 2D graphics library to build one of its core features using the canvas.

## Constraints

- The library must provide an easy-to-use API for creating and manipulating canvas elements.
- The library should be well-supported and have a strong community.
- The library should be able to import well-known raster formats.
- Optionally, the library should also support drawing operations.
- The library must be free software, compatible with our license.
- The library must be compatible at least on Chromium and Firefox.

## Assumptions

## Considered Alternatives

- HTML5 Canvas API: 
The [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API?retiredLocale=de) is a widely-supported and well-documented option for creating and manipulating 2D graphics in a web page. 
However, it provides a low-level API that may require more work to use than some of the other options.
For example, the HTML5 canvas API does not provide a built-in support for grouping or layering elements which can make it more difficult to organize and manipulate complex graphic elements.
- Raphaël: 
[Raphaël](https://dmitrybaranovskiy.github.io/raphael/) is a JavaScript library that provides a simple API for creating and manipulating SVG graphics. 
However, it may not be as well-suited for creating canvas-based graphics as some of the other options.
- Pixi.js: 
[Pixi.js](https://pixijs.com/) is a 2D graphics library that is designed for creating fast, interactive graphics for games and other applications. 
However, it relies on [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API?retiredLocale=de) for rendering.
One of the main disadvantages of WebGL is that it can be resource-intensive, as it relies on the GPU to render graphics and animations.
In addition, WebGL requires a modern web browser that supports the API, which may not be available on older devices. 
This can limit the reach of applications that use WebGL.
Furthermore, WebGL is not necessarily needed when creating a canvas-based application, as the HTML5 Canvas API and libraries built on top of it already provide a set of tools and functions for drawing and manipulating graphics on a canvas element.

## Decision

We will use [Konva](https://konvajs.org/) as the 2D graphics library for the Permaplant app.

## Rationale

Konva is a well-supported and widely-used 2D graphics library. 
It has support for a wide range of features, including drawing shapes, text, and images, as well as transformations and animations. 
It is built on top of the HTML Canvas API and provides a higher-level, more declarative interface for creating and manipulating canvas elements.

## Implications

## Related Decisions

## Notes
