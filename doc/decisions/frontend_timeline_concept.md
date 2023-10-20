# Frontend State Management

## Problem

PermaplanT is a web application built with React that requires efficient and flexible state management.
Inside a React application we can usually distinguish between three types of state:

1. Local Component State: Is the dropdown open or not, is the link active or not, and so on.
2. Global Application State (Synchronous): Local user preferences, Sidenav is open, UI state in a visual design app.
3. Server State (Asynchronous): A network request is needed before any state can be derived.

## Constraints

- The state management library must support React and work seamlessly with the rest of the application's technology stack.
- The library should be well-maintained, have a large community of developers, and a good documentation.

## Considered Alternatives

### Global Application State

- [Redux](https://redux.js.org/)
  Requires more complex setup, boilerplate and has a steeper learning curve than Zustand.
- [React context](https://reactjs.org/docs/context.html)
  Requires complex custom state management solution for complex application
- [MobX](https://mobx.js.org/)
  Requires basic understanding of reactive programming - may otherwise lead to inconsistencies and performance problems.
- [Recoil](https://recoiljs.org/)
  Recoil is still in experimental state, not yet recommended for production (16.03.2023).

### Server State

- [SWR](https://github.com/vercel/swr)
  Fewer features than React Query

## Decision

### Local Component State

No library is needed.

Managing component state can be accomplished with React features (useState, Context + useReducer).

### Global Application State

[Zustand](https://github.com/pmndrs/zustand) will be used as the global state management library for PermaplanT.

Zustand is a lightweight and easy-to-use library that uses hooks, which makes it easy to integrate with React.
Its simplicity also reduces the amount of boilerplate code and the need for complex setup and configuration.

Zustand also provides the [Persist](https://docs.pmnd.rs/zustand/integrations/persisting-store-data) middleware which enables storing state in any type of storage.
Another benefit of Persist is the serialization and deserialization support for fields of type _Map_ and _Set_.  
Persist's [partialize](https://docs.pmnd.rs/zustand/integrations/persisting-store-data#partialize) method can be used to store only selected fields of the state.

### Server State

[TanStack React Query v4](https://www.npmjs.com/package/@tanstack/react-query) will be used for managing asynchronous state.

React Query is a feature rich, up-to-date library for managing asynchronous data.

## Implications

## Related Decisions

- Choosing React as the [frontend library](./frontend_ui_framework.md) for PermaplanT

## Notes

## Links

- https://medium.com/readytowork-org/its-zustand-vs-redux-8e24424df713
- https://tanstack.com/query/latest/docs/react/guides/does-this-replace-client-state
- https://tanstack.com/query/v4/docs/react/comparison
