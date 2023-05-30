# Frontend Lazyloading

## Problem

The application's main component is the map, which consists of multiple layers and even more elements.
The map does not only consist of elements for the current date, but also for the past and future dates.
Not all layers or elements are visible simultaneously, however, nor are they required during the initial loading of the application.

Loading all the data at once during the initial load may result in slower performance, therefore a strategy must be developed to lazyload data on the map to optimize its performance.
In other words, the data which is not required for the user to start working with the map should not be loaded during the startup.

## Constraints

- Fast startup time
- Supports performance constraints of the usecases

## Assumptions

1. The majority of layers are only modified once a year
2. The loading of all the data at once during the initial load would result in unacceptable performance

## Solutions

### Full fetch

Fetching all the data from the backend during the initial load, while making the map available immediately, may not be the most optimal solution as it would lead to a slower initial load time.

Compared to the other solutions, network traffic would be higher due to the larger payload, and the user may have to wait longer before being able to interact with the map.

### Pagination

If map data would be stored in a single table with uniform entries in a database, we could use pagination to retrieve the data in sections.
This approach would enable loading only the essential data during the initial load by fetching a specific portion i.e. page of the data.

However, since the canvas data is structured in a nested manner, we cannot implement the same approach of fetching data in sections as we would do with a flat array structure.

### SQL VIEW tables

To avoid fetching unnecessary data during the initial load, an SQL view could be created on the database side i.e. return only visible layers for the current date.

Implementing this solution, however, would require writing additional SQL queries.
This may not be the most efficient approach since the same outcome can be achieved through the parameterized backend (which is using the rust query builder anyway) endpoints described below in the final solution.

## Decision

In order to improve the performance of the application's initial load, it is advisable to load only the necessary data and load the rest on demand.
The most effective way to achieve this is through the backend, which can define endpoints with additional parameters that allow the frontend to request only the required data for the initial load:

- separate endpoints for different layers
- have date as paramter to these endpoints so that only the current relevant elements (already added, not yet removed) can be retrieved

## Rationale

Creating endpoints with additional parameters that allow the frontend to request only the required data for the initial load is a more flexible way to implement lazy loading compared to other approaches.
This will allow backend developers to define the strategy themselves and have full control over the data that is being loaded.

The following table is the outcome of the performance tests that were conducted by measuring the loading times of the application with different number of elements and layers on the map.
As it can be seen, the number of layers does not have a significant impact on the loading time, however, the number of elements does.

| Test name                   | firstContentfulPaint (ms) | interactive (ms) |
| --------------------------- | ------------------------- | ---------------- |
| empty canvas                | 4971.2                    | 6184.8           |
| 3 elements                  | 4968.6                    | 6232.8           |
| 3 circles of same shape     | 4966.2                    | 6266.8           |
| 100 circles                 | 4966.6                    | 6175.6           |
| 1000 circles                | 4690                      | 7634.6           |
| 10000 circles with 1 layer  | 4963                      | 26389.2          |
| 10000 circles with 10 layer | 4958.4                    | 26790.6          |

## Implications

N/A

## Related Decisions

N/A

## Notes

- Performance tips from KonvaJS:
  https://konvajs.org/docs/performance/All_Performance_Tips.html
- Drag and Drop Stress Test with 10000 Shapes
  https://konvajs.org/docs/sandbox/Drag_and_Drop_Stress_Test.html
