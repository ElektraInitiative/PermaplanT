# Solution Strategy

PermaplanT has a classical frontend/backend architecture:

- the frontend is structured according features
- the backend has a 3-layer architecture with a database

## Type Safety

We use specific types (prefer enum over int over string etc.) and share types whenever possible:

- [Diesel](https://diesel.rs/) is used to share types between the database and backend code.
  We use type-safe queries (and not raw queries), whenever possible.
- [typeshare](https://crates.io/crates/typeshare) is used to share types between Rust, API and Typescript.

## Validation

- The frontend should validate data as early as possible, usually during input using [React Hook Form](https://react-hook-form.com/).
- We don't need to validate data in the backend.

## State

- Both frontend and database contain the latest and complete state.
- The backend is state-less, all state is in the database or in the token.
- The frontend has structured state per layer.

[See also frontend state management](../decisions/frontend_state_management.md) for which libraries are being used.

## Concurrent Use

The user wants to see changes that other users are making on the map, therefore the data needs to be kept in sync.
The data is kept in sync between the client and the server through [API calls with axios](https://www.npmjs.com/package/axios) and server-sent events (SSE).
This means the backend is always up to date with the users actions and users can see what others are doing.

- Data must be immediately send asynchronously to the backend on any user action.
- Calculations in the backend can always assume that database is up-to-date.
- No timestamps are needed for data consistency.
- No conflict handling in the frontend.
- If a user loses the connection, the frontend must go into a read-only state.

### Actions

Actions are minimal, encapsulated state changes from elements on the layer of a map.
Such actions are used to:

1. describe user actions in the frontend (undo/redo, see later)
2. describe transport of 1. to the backend (via PATCH API calls)
3. describe transport of 1. back to other frontends (via SSE)

### SEE

For SSE, browsers first request an event-source via the endpoint /api/updates/maps.
Then the backend sends all updates of a map to all users connected to the maps.
To do so, all API calls in the backend must notify the broadcaster.

The broadcaster lives in AppDataInner, which is available in request handler via dependency injection in the request context.
So every controller related to map endpoints must must use AppDataInner.
At the end of every request handler, you need to have a statement like:

`app_data.broadcaster.broadcast(map_id, action)`

> Note that login data is implemented differently.

### Undo & Redo

Undo/redo is client-specific so a user can only undo their own changes.
The undo/redo functionality is implemented by means of an inverse (opposite) action.
For this to work the actions have to exactly encompass the state they are mutating.

E.g. a movement action should only have the new coordinates, and an uuid as payload.

```ts
type MovementAction {
  type: 'MOVEMENT_ACTION';
  payload: {
    uuid: string;
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

## Identity and Access Management

Only the landing page can be seen without registration.
We use [Keycloak](https://www.keycloak.org/) for Identity and Access Management with 3 roles:

1. default-roles-permaplant (only [public maps and the membership application](../usecases/current/membership_application.md) can be visited)
2. member (can do everything but administration tasks)
3. admin (possibility to change data from other users, as needed for onboarding or offboarding)

## Privacy

In general all data must to stay within the organisation (Verein) and can only be seen by members or even only admins.
Data which makes a person identifiable should be in Keycloak.
The only exceptions are:

- bank account and billing address, which gets completely removed from the server (for security reasons)
- public maps are visible to non-members but most meta-data won't be shown and the location gets obfuscated
