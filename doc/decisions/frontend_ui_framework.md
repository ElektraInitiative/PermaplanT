# Frontend UI Framework 

## Problem

We need to choose a UI framework for the PermaplanT app that will enable us to create a beautiful and easy-to-use interface and that is well-suited for building PWAs with JavaScript.

## Constraints

- The framework must be compatible with the PWA architecture.
- The framework must be able to handle complex, data-intensive operations such as checks for sun, soil, good/bad neighbors, and time of year.

## Assumptions

- React is a popular and widely-used framework for building user interfaces, which means that there will be a large community of developers available to help with any issues that arise.
- React allows for the creation of reusable components, which will be useful for building the various modes and features of the PermaplanT app.
- React is fast and efficient, which will be important for providing users with a smooth and responsive experience.

## Considered Alternatives

- [Tamagui](https://tamagui.dev/blog/version-one)
- [React Native](https://reactnative.dev/)
- [AngularJS](https://angularjs.org/)
- [Vue.js](https://vuejs.org/)

## Decision

We will use [React](https://reactjs.org/) (18.2.0) as the frontend ui framework for app. 

## Rationale

React is a popular JavaScript library for building user interfaces, and it is a good choice for building progressive web apps (PWAs) for several reasons. 
Some of the key advantages of using React for PWAs include its performance, flexibility, and developer-friendly ecosystem. 
React uses a declarative approach to building user interfaces, which makes it easy to create complex and interactive PWAs. 
Additionally, React has a large and active community of developers, with a wealth of resources and tools available, such as libraries, components, and tutorials.

## Implications

## Related Decisions

- The decision to use a declarative and component-based approach for the app's UI

## Notes
