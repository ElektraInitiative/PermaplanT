# Solution Strategy

PermaplanT has a classical frontend/backend architecture.

## Concurrent Use

The user wants to view changes that other users have made on the map, therefore the data needs to be kept in sync.
The user should also be able to access some features of the application while being offline and later synchronize her changes to the server.

## Data Consistency

The data is kept in sync between the client and the server through a websocket connection.
This means the backend is always kept in sync with the users actions and users can see what others are doing.
No timestamps are needed for data consistency.

### Undo & Redo

Undo/redo is client-specific so a user can only undo their own changes.
The undo/redo functionality is implemented by means of an inverse (opposite) action.
For this to work the actions have to exactly encompass the state they are mutating.

E.g. a movement action should only have the new coordinates, and an identifier as payload.

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

For inspiration you can read more at [this liveblocks.io blog post](https://liveblocks.io/blog/how-to-build-undo-redo-in-a-multiplayer-environment).

Undo/redo gets lost if other users concurrently move or edit elements.

### Offline Changes

If a user loses the connection, the application goes into a read-only state.

If a user requests to work offline, the layers will be locked for that user in the backend.
While the lock is active, other users see these layers read-only.

Upon coming back online the changes made are synchronized and the lock is released.
