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
- For more complex validation logic, we use [Zod](https://zod.dev/) in conjunction with [React Hook Form Schema Validation](https://react-hook-form.com/get-started#SchemaValidation).
  For example Zod should be used over default React Hook Form validation when there are inter-dependent form values that need to be validated together, such as validating that a start date is before an end date.
- All constraints that go beyond the types, e.g. automated validation while [extracting via serde](https://docs.rs/actix-web/latest/actix_web/web/struct.Json.html#extractor), should be explicitly validated by the backend as well as the frontend.
  This is because some constraints could be bypassed by just validating in the frontend.
  For example, payment data or data associated with gamification achievements should be validated in the backend to ensure data consistency and prevent security vulnerabilities.

## State

- Both frontend and database contain the latest and complete state.
- The backend is state-less, all state is in the database or in the auth token.
- The frontends map editor has structured state per layer.

[See also frontend state management](../decisions/frontend_state_management.md) for which libraries are being used.

## API

The API is implemented in the backend.
The backend is stateless (except of the data base) and agnostic to language.
The backend serves no other purpose as being used by the frontend, so:

- it can be tailored to the needs of the frontend
- the frontend ideally only needs to do a single API call to get what it needs

## Concurrent Use

The user wants to see changes that other users are making on the map, therefore the data needs to be kept in sync.
The data is kept in sync between the client and the server through [API calls with axios](https://www.npmjs.com/package/axios) and server-sent events (SSE).
This means the backend is always up to date with the users actions and users can see what others are doing.

- Data must be sent immediately and asynchronously to the backend after any user action (via API).
- Calculations in the backend can always assume that database is up-to-date.
- No timestamps are needed for data consistency.
- There is no conflict handling in the frontend.
- If a user loses the connection, the frontend must go into a read-only state.
- We use uuid to identify frontend-created database entries, like elements on the map.

### Actions

Actions are minimal, encapsulated state changes from elements on the layer of a map.
Such actions are used to:

1. describe user actions in the frontend (undo/redo, see later)
2. describe transport of 1. to the backend (via PATCH API calls)
3. describe transport of 1. back to other frontends (via SSE)

### SSE

For SSE, browsers first request an event-source via the endpoint /api/updates/maps.
Then the backend sends all updates of a map to all users connected to the maps.
To do so, all API calls in the backend must notify the broadcaster.
This includes all changes of elements but also changes to layers, map metadata, chat etc.
Any polling should be avoided.

The broadcaster lives in AppDataInner, which is available in request handler via dependency injection in the request context.
So every controller related to map endpoints must must use AppDataInner.
At the end of every request handler, you need to have a statement like:

`app_data.broadcaster.broadcast(map_id, action)`

> Note that login data is implemented differently.

### Undo & Redo

Undo/redo is client-specific so a user can only undo their own changes.
The undo/redo functionality is implemented by means of an inverse (opposite) action.
For this to work the actions have to exactly encompass the state they are mutating.

For example, a movement action should only have the new coordinates and the identifier for the entity it moves, as well as an identifier for the action itself (using UUIDs), as payload.

```ts
type MovementAction {
  type: 'MOVEMENT_ACTION';
  payload: {
    id: string;
    actionId: string;
    x: number;
    y: number;
  };
}
```

- The same actions are also used for communication to the backend.
- Undo/redo gets lost if other users concurrently move or edit elements.
  For inspiration you can read more at [this liveblocks.io blog post](https://liveblocks.io/blog/how-to-build-undo-redo-in-a-multiplayer-environment).

## Performance

- per user action only a minimal number of API calls should be used (ideally one)
- relations are only calculated to plants within bounding box

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

## Identity and Access Management

Only the landing page can be seen without registration.
We use [Keycloak](https://www.keycloak.org/) for Identity and Access Management with 3 roles:

1. default-roles-permaplant (only public maps can be visited)
2. member (can do everything but administration tasks)
3. admin (possibility to change data from other users, as needed for onboarding or offboarding)

## Privacy

In general all data must stay within the organisation (Verein).
Members see other members' data only if they allowed it.
Data which makes a person identifiable should be in Keycloak.
The only exceptions are:

- bank account and billing address, which gets completely removed from the server (for security reasons)
- public maps are visible to non-members but most meta-data won't be shown and the location gets obfuscated

## Coordinate System

The backend uses the same coordinate system as the frontend.

(0,0) is in the top left corner.  
The x-value increases when going to the right and the y-value increases when going down.

The scale is set to be in cm, so increasing x by 1 would mean going to the right by 1cm.

The granularity of the heatmap is set to 10cm via the constant `GRANULARITY` in the backend.  
This means that the heatmap is generated by dividing the maps geometry into 10x10cm squares for each of which a score is computed.
