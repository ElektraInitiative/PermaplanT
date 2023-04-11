# Offloading of the frontend state

## Problem

As the user continues to add more layers and objects to the map, it may lead to slower performance and increased memory usage on the client side.
To avoid this, a strategy must be developed to offload the data that has already been synchronized with the backend from the frontend.
While the decision primarily focuses on the map, its underlying principle of offloading synchronized data from the frontend can be extended to other data modules as well.

## Constraints

- Memory usage should be kept to a minimum to avoid performance issues
- The application should be able to handle large amounts of data

## Assumptions

N/A

## Solutions

### Remove unused data from the frontend state

One solution to offload the data from the frontend state is to frequently remove the data that is not required for the user to continue working with the map.

However, this approach can increase the application's complexity, as it requires defining the conditions under which data should be removed from the state e.g. offload data that is not visible on the map or offload data that is not required for the currently selected date.

### Store data in IndexedDB

Another solution is to store the offloaded data in IndexedDB, which is a browser-based object-oriented database.

This approach could reduce memory usage and improve performance, as objects can be offloaded and loaded on-demand from the IndexedDB, while not storing them in the PermaplanT database.
But this method increases the complexity of the application, as it requires additional strategies to manage the synchronization of data between the IndexedDB and the PermaplanT database.

The official documentation of IndexedDB can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

## Decision

The state of the frontend application will be kept in the React state without offloading it. However, the decision suggests keeping the state as structured as possible to avoid performance issues.

The maximum size of the React state is not explicitly defined in the official documentation, but it is related to the device's RAM and the browser's memory usage.
Even though the state will not be offloaded, it is still important to keep it as structured as possible due to the rendering process on the frontend side.

## Rationale

Even though modern browsers handle memory usage well, it's important to consider the impact of the state size on application rendering.

React utilizes a [virtual DOM](https://legacy.reactjs.org/docs/faq-internals.html)(The Document Object Model i.e. _DOM_) that's a copy of the real DOM, and it compares them when the state changes to update only the necessary parts of the real DOM.

As a result, if the entire map information is stored in a single object, any state changes(e.g. changing the position of an object) will require updates to every element of the real DOM, which depend on the map information i.e. the entire map.
Therefore, keeping the state as structured as possible in it can help optimize application rendering.

## Implications

- Undo/redo functionality
  - Once the data is offloaded and permanently removed from the frontend state, it can't be retrieved to utilize the undo/redo functionality anymore. So for the undo/redo functionality, it will be the same as the fresh start of the application.

## Related Decisions

- [Map undo redo implementation](/doc/decisions/map_undo_redo_implementation.md)

## Notes

- IndexedDB. Mozilla Developer Network (MDN) documentation on IndexedDB:

  https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
