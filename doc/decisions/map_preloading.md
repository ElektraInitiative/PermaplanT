# Map Preloading

## Problem

The application's main component is the map, which consists of multiple layers and even more objects. However, not all layers are visible simultaneously, nor are they required during the initial loading of the application. Loading all the data at once during the initial load may result in slower performance, therefore a strategy must be developed to preload data on the map to optimize its performance.

## Constraints

1.

## Assumptions

1.

## Solutions

### Full fetch

Load all the data from the backend on the initial load. This will result in a slower initial load, but the map will be ready to use immediately.

### Pagination

Since the canvas data is stored in a nested manner, we cannot simply fetch the data in chunks as we would do it with a flat array structure.

### SQL VIEW tables

The data can be preloaded on the database side by creating a view that will contain only the data required for the initial load.

## Decision

In order to improve the performance of the application's initial load, it is advisable to load only the necessary data and load the rest on-demand. The most effective way to achieve this is through the backend, which can define endpoints that allow the frontend to request only the required data for the initial load.

## Rationale

The majority of layers are only modified once a year and are solely required for backend calculations. Loading all of this data at all times would be impractical.

## Implications

-
-
-

## Related Decisions

-   []()
-   []()
-   []()

## Notes

-   https://konvajs.org/docs/performance/All_Performance_Tips.html
