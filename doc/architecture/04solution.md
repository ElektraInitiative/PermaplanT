# Solution Strategy

PermaplanT has a server-side component with a database for plants.

## Data Consistency

The data is kept in sync between the client and the server through a websocket connection.
This means the backend is always kept in sync with the users actions and users can see what others are doing.

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

### Offline Changes

If a user loses the connection, the application goes into an read only state (first version).

In a later version a user requests a lock for doing changes in an offline environment.
This means the user explicitly decides to do work offline.
Other users are unable to make changes while the lock is active.
Upon coming back online the changes made by the lock keeping user, are synchronized and the lock is released.
