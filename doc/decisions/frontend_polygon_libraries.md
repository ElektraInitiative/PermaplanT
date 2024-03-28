# Polygon Libraries

## Problem

For drawing areas of shadings, hydrology, zones, etc., we need to transform a set of points, drawn using a brush, into a polygon. Furthermore, we want to be able to create unions of polygons so that areas can be expanded and differences of polygons to reduce areas.

## Constraints

- Algorithms need to be fast enough so that users won't recognize any delays.

## Assumptions

- We assume that there are no alternative packages readily available that offer significantly better performance or features than the ones we have explored.

## Solutions

### graham_scan

[graham-scan](https://www.npmjs.com/package/graham_scan) is an implementation of the Graham Scan algorithm to calculate a convex hull from a given set of points.

- Easy to integrate.
- It only provides convex hull calculation.

### hull.js

[hull.js](https://www.npmjs.com/package/hull.js) provides functions for calculating convex and concave hulls from a given set of points.

- Concavity can be configured by a parameter.
- Very easy to integrate.
- Fast calculation.

### polygon-clipping

[polygon-clipping](https://www.npmjs.com/package/polygon-clipping) provides boolean polygon operations like intersection, union, and difference.

- Well maintained.

### Further packages

- There are several other packages like [flatten-js/boolean-op](https://www.npmjs.com/package/@flatten-js/boolean-op). However, most of them haven't been updated in a long time.

> Note: Click [here](https://www.researchgate.net/profile/Zahrah-Yahya-Assoc-Prof-Ts-Dr/publication/312373158/figure/fig5/AS:668462426898432@1536385270015/Classification-of-convex-and-concave-hull-Adapted-from-6.png) to see an image that shows the difference between convex and concave hulls.

## Decision

We decided to use [hull.js](https://www.npmjs.com/package/hull.js) for calculating hulls and [polygon-clipping](https://www.npmjs.com/package/polygon-clipping) for union operations.

## Rationale

### Hull Calculation

- hull.js is very easy to integrate. We already tested it in the drawing layer and it was easy to calculate a polygon by passing a set of drawn points.
- The calculation is very fast.
- We can configure how precisely the polygon should match the drawn shape.

### Boolean Operation

- polygon-clipping provides all the operations we need to unify polygons and it is regularly updated.
