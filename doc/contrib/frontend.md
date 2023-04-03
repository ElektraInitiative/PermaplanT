# Contributing to Frontend

## Hooks

The frontend uses pre-commit hooks to ensure certain actions such as linting will be done before a commit succeeds.
To enable this, make sure to set the right permissions:

```shell
chmod ug+x .husky/*
```

## Project Structure

The majority of the code resides in `src`.

```
src
|
+-- components        # shared components used across the entire application
|
+-- config            # all the global configuration, env variables etc. get exported from here and used in the app
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- routes            # routes configuration
|
+-- stores            # global state stores
|
+-- test              # test utilities and mock server
|
+-- types             # base types used across the application
|
+-- utils             # shared utility functions
```

Ultimately we develop a new feature in the `features` folder that contains domain specific code for a given feature.

A feature could have the following structure:

```
src/features/new-feature
|
+-- api         # exported API request declarations and api hooks related to a specific feature
|
+-- components  # components scoped to a specific feature
|
+-- hooks       # hooks scoped to a specific feature
|
+-- routes      # route components for a specific feature pages
|
+-- stores      # state stores for a specific feature
|
+-- types       # typescript types for TS specific feature domain
|
+-- utils       # utility functions for a specific feature
|
+-- index.ts    # entry point for the feature, it should serve as the public API of the given feature and exports everything that should be used outside the feature
```

The index.ts file of each feature should serve as its public API, and all elements within that feature should be exported from it. When importing elements from other features, use the feature's root directory, like this:

``` typescript
import {MyComponent} from "@/features/my-feature"
```

Avoid importing elements directly from subdirectories within a feature, like this:

``` typescript
import {MyComponent} from "@/features/my-feature/components/MyComponent"
```

Think of a feature as a library or a module that is self-contained but can expose different parts to other features via its entry point.

## Component Design

Purely presentational components should be side effect free.
That means they should not make any network requests or communicate with external systems.

Take of example a button component that is used as the login button.

- It should not make the login request itself.
It should rather have an `onClick` prop that is passed to it.
- Neither should the login button make a request to see if the user is already logged in.
It should be hidden by one of it's ancestor components.

That has the added benefit, that presentational components can be easily integrated into Storybook.

## Helpful Links

React:

- [The new React documentation (as of 16.03.2023)](https://react.dev/learn)
- [Advanced and detailed blog](https://kentcdodds.com/blog?q=react)

Zustand (Global State Management):

- [Tutorial](https://blog.logrocket.com/managing-react-state-zustand/)
- [The Zustand documentation](https://github.com/pmndrs/zustand)

Storybook:
- [How to structure a storybook](https://storybook.js.org/blog/structuring-your-storybook/)
