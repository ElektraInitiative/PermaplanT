# Map Lazyloading

## Problem

The application's main component is the map, which consists of multiple layers and even more objects.
One more thing to consider is that the map consists not only of the data for the current date, but also for the past and future dates e.g. harvest time, planting history.
However, not all layers are visible simultaneously, nor are they required during the initial loading of the application.

Loading all the data at once during the initial load may result in slower performance, therefore a strategy must be developed to lazyload data on the map to optimize its performance.
In other words, the data which is not required for the user to start working with the map should not be loaded during the startup.

## Constraints

-   Fast startup time
-   Supports performance constraints of the usecases

## Assumptions

1. The majority of layers are only modified once a year
2. The loading of all the data at once during the initial load will result in slower performance

## Solutions

### Full fetch

Fetching all the data from the backend during the initial load, while making the map available immediately, may not be the most optimal solution as it would lead to a slower initial load time.

### Pagination

If data is stored in a single table with uniform entries in a database, we can use pagination to retrieve the data in sections.
This approach enables to load only the essential data during the initial load by fetching a specific portion i.e. page of the data.

However, since canvas data is structured in a nested manner, we cannot implement the same approach of fetching data in sections as we would do with a flat array structure.

### SQL VIEW tables

To avoid fetching unnecessary data during the initial load, an SQL view can be created on the database side i.e. return only visible layers for the current date.
However, implementing this solution may require writing additional SQL queries, which may not be the most efficient approach since the same outcome can be achieved through the backend, which is using the rust query builder anyway.

## Decision

In order to improve the performance of the application's initial load, it is advisable to load only the necessary data and load the rest on-demand.
The most effective way to achieve this is through the backend, which can define endpoints with additional parameteres that allow the frontend to request only the required data for the initial load.

## Rationale

Creating endpoints with additional parameters that allow the frontend to request only the required data for the initial load is more flexible way to implement lazyloading compared to other approaches.
This will allow backend developers to define the strategy themselves and have the full control over the data that is being loaded.

## Implications

N/A

## Related Decisions

N/A

## Notes

-   Performance tips from KonvaJS:
    https://konvajs.org/docs/performance/All_Performance_Tips.html
