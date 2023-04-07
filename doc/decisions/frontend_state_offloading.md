# Offloading of the frontend state

## Problem

As the user continues to add more layers and objects to the map, it may lead to slower performance and increased memory usage on the client side.
To avoid this, a strategy must be developed to offload the data that has already been synchronized with the backend from the frontend.
While the decision primarily focuses on the map, its underlying principle of offloading synchronized data from the frontend can be extended to other data modules as well.

## Constraints

-   Memory usage should be kept to a minimum to avoid performance issues
-   The application should be able to handle large amounts of data

## Assumptions

N/A

## Solutions

### Remove unused data from the frontend state

One solution to offload the data from the frontend state is to remove the data that is not required for the user to continue working with the map.
However, this approach can increase the application's complexity, as it requires defining the conditions under which data should be removed from the state e.g. offload data that is not visible on the map or offload data that is not required for the currently selected date.

### Store data in IndexedDB

Another solution is to store the offloaded data in IndexedDB, which is a browser-based object-oriented database.
This approach could reduce memory usage and improve performance, as objects can be offloaded and loaded on-demand from the IndexedDB, while not storing them in the PermaplanT database.
But this method increases the complexity of the application, as it requires additional strategies to manage the synchronization of data between the IndexedDB and the PermaplanT database.

## Decision

The maximum size of the React state is not explicitly defined in the official documentation, but it is related to the device's RAM and the browser's memory usage.
In general, the size of the state shouldn't cause a problem, even for large states.
However, it's recommended to keep the state as structured as possible.

## Rationale

Even though modern browsers handle memory usage well, it's important to consider the impact of state size on application rendering.
React utilizes a virtual DOM that's a copy of the real DOM, and it compares them when the state changes to update only the necessary parts of the real DOM.
However, if the state is too large, it can take a long time to compare the virtual and real DOMs, leading to performance issues.
Therefore, keeping the state as structured as possible and avoiding storing large objects in it can help optimize application rendering.

## Implications

-   Undo/redo functionality
    -   Once the data is offloaded and permanently removed from the frontend state, it can't be retrieved to utilize the undo/redo functionality anymore. So for the undo/redo functionality, it will be the same as the fresh start of the application.

## Related Decisions

-   [Map undo redo implementation](/doc/decisions/map_undo_redo_implementation.md)

## Notes

-   Mozilla Developer Network (MDN) documentation on IndexedDB:
    https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
