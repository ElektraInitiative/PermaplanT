# Solution Strategy

PermaplanT has a classical frontend/backend architecture.

## Concurrent Use

The user wants to see changes that other users are making on the map, therefore the data needs to be kept in sync.
The data is kept in sync between the client and the server through API calls and server-sent events (SSE).
This means the backend is always up to date with the users actions and users can see what others are doing.

- Data must be immediately send asynchronously to the backend on any user action.
- Calculations in the backend can always assume that database is up-to-date.
- No timestamps are needed for data consistency.
- No conflict handling in the frontend.
- If a user loses the connection, the frontend must go into a read-only state.

### Undo & Redo

Undo/redo is client-specific so a user can only undo their own changes.
The undo/redo functionality is implemented by means of an inverse (opposite) action.
For this to work the actions have to exactly encompass the state they are mutating.

E.g. a movement action should only have the new coordinates, and an identifier as payload.
TODO @Bushuo: what is the identifier for?

```ts
type MovementAction {
  type: 'MOVEMENT_ACTION';
  payload: {
    id: string;
    x: number;
    y: number;
  };
}
```

- The same actions are also used for communication to the backend.
- Undo/redo gets lost if other users concurrently move or edit elements.
  For inspiration you can read more at [this liveblocks.io blog post](https://liveblocks.io/blog/how-to-build-undo-redo-in-a-multiplayer-environment).

## Low Memory Consumption

As the planning tools are also used for longer sessions, e.g. a whole working day, it is essential to keep the memory usage at acceptable levels:

- state is strongly structured for performance reasons, every layer writes in its own parts
- we only use essential layers at startup, see [lazy loading](../decisions/frontend_lazyloading.md)
- we do offloading of layers that are not used for some time, see [offloading](../decisions/frontend_offloading.md)

To keep the backend with low memory consumption we try to avoid duplicating data from the database to memory other than when sending it to the client.

## Layers

Layers are kept independent, they have their own:

- state hierarchy
- API calls to the backend

I.e. each layer is responsible to handle:

- the time functionality (which elements are loaded and which are shown)
- add, edit, move, remove and delete functionality
- offload data

The implementation, however, should be shared.

## Offline Changes

The user should also be able to access some features of the application while being offline and later synchronize her changes to the server.
If a user requests to work offline, the layers will be locked for that user in the backend.
While the lock is active, other users see these layers read-only.

Upon coming back online the changes made are synchronized and the lock is released.

See also [offline use case](../usecases/assigned/offline.md).
