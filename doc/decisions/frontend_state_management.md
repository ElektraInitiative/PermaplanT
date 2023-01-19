# Frontend State Management Library

## Problem

PermaplanT is a web application built with React that requires efficient and flexible state management.


## Constraints

- The state management library must support React and work seamlessly with the rest of the application's technology stack.
- The library should be well-maintained, have a large community of developers, and a good documentation.

## Considered Alternatives

- [Redux](https://redux.js.org/)
- [React context](https://reactjs.org/docs/context.html)
- [MobX](https://mobx.js.org/)

## Decision

[Zustand](https://github.com/pmndrs/zustand) will be used as the state management library for PermaplanT.

## Rationale

Zustand is a lightweight and easy-to-use library that uses hooks, which makes it easy to integrate with React. Its simplicity also reduces the amount of boilerplate code and the need for complex setup and configuration.

## Implications

## Related Decisions
 - Choosing React as the frontend library for PermaplanT

## Notes
