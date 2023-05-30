# Frontend Offloading

## Problem

As the user continues to add more layers and objects to the map, it may lead to slower performance and increased memory usage on the client side.
To avoid this, a strategy must be developed to offload the data that has already been synchronized with the backend from the frontend.

## Constraints

- Memory usage should be kept to a minimum to avoid performance issues
- The application should be able to handle large amounts of data

## Assumptions

- Users typically don't do changes across all years.
- Users might be invited to activate many layers for a short time due to gamification.
- Memory issues only occur when having many layers active and not because of a single layer.

## Solutions

### No Offloading

The state of the frontend application will be kept in the React state without offloading it.

The maximum size of the React state is not explicitly defined in the official documentation, but it is related to the device's RAM and the browser's memory usage.

### Remove Unused Elements from the Frontend State

One solution to offload data from the frontend state is to remove the data that is not frequently required for the user to continue working with the map.
This approach can increase the application's complexity, however, as it requires:

- defining the conditions under which data should be removed from the state.
  E.g. offload data that is not visible on the map or offload data that is not required for the currently selected date.
- how to retrieve the data again.

### Store Data in IndexedDB

Another solution is to store the offloaded data in IndexedDB, which is a browser-based object-oriented database.

This approach could reduce memory usage and improve performance, as objects can be offloaded and loaded on-demand from the IndexedDB, while not storing them in the PermaplanT database.
But this method increases the complexity of the application, as it requires additional strategies to manage the synchronization of data between the IndexedDB and the PermaplanT database.

The official documentation of IndexedDB can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

## Decision

We offload layers with the highest amount of objects that were not used for a longer time (~15 min) from the frontend state.

Furthermore, we keep the state as structured as possible

## Rationale

While similar to remove unused elements, per layer is a more efficient:

- only a few rules are needed:
  only per layer and only for the layers with many elements
- tracking when the layer was activated last time is much easier than tracking individual elements

The disadvantage of this approach is, that it cannot scope with memory issues within a single layer.
(Or only indirectly: if a layer gets offloaded, then also all years of that layer are discarded.)

Even though modern browsers handle memory usage well, it's important to consider the impact of the state size on application rendering.
React utilizes a [virtual DOM](https://legacy.reactjs.org/docs/faq-internals.html)(The Document Object Model i.e. _DOM_) that's a copy of the real DOM, and it compares them when the state changes to update only the necessary parts of the real DOM.
As a result, if the entire map information is stored in a single object, any state changes (e.g. changing the position of an object) will require updates to every element of the real DOM, which depend on the map information i.e. the entire map.
Therefore, keeping the state as structured as possible in it can help optimize application rendering.

## Implications

- Undo/redo functionality:
  Once the data is offloaded and permanently removed from the frontend state, it can't be retrieved to utilize the undo/redo functionality anymore.
  So for the undo/redo functionality, it will be the same as the fresh start of the application.
  I.e. for layers that were offloaded, undo/redo is lost.
- Structured state:
  As there is no offloading within a layer, we need to keeping the state as structured as possible to avoid performance issues.

## Related Decisions

- [Map undo redo implementation](/doc/decisions/map_undo_redo_implementation.md)

## Notes

- IndexedDB. Mozilla Developer Network (MDN) documentation on IndexedDB:

  https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
