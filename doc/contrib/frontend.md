# Contributing to Frontend

## Project Structure

The majority of the code resides in `src`.

```txt
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

```txt
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

```typescript
import { MyComponent } from "@/features/my-feature";
```

Avoid importing elements directly from subdirectories within a feature, like this:

```typescript
import { MyComponent } from "@/features/my-feature/components/MyComponent";
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

## Documentation

We use [Storybook](https://storybook.js.org) to document shared components.
Story files are named `*.stories.tsx` and should be located in the same folder as the component they are documenting.
For an example please take a look in the `src/components` folder.

For other API documentation like Hooks and utility functions, we use [TypeDoc](https://typedoc.org/).
Run `npm run doc` to generate the TypeDoc documentation under `src/generated/docs`.
The generated documentation is automatically integrated into Storybook under the menu `DOCS`.
There is also the possibility to display additional documentation inside the `DOCS` menu in storybook.
Such additional documentation files should be created in the `src/docs` directory for Storybook to recognize them.
Furthermore, an additional documentation file must be a `.mdx` file and it has to export a header like this.

```tsx
import { Meta } from "@storybook/addon-docs";

<Meta
  title="docs/<name_of_documentation_file>"
  parameters={{
    viewMode: "docs",
    previewTabs: {
      canvas: { hidden: true },
    },
  }}
/>;
```

Storybook will display an error if the `.mdx` file does not have valid [MDX2](https://mdxjs.com/blog/v2/) syntax.

Minimum requirements for every component:

- one story file, probably with several exports for different states, see `SimpleButton.stories.tsx`
- Document all props

## Bootstrapping (Order of Execution)

The entry point for the frontend is `src/main.tsx`.
From there three modules get imported `src/Root.tsx`, `src/App.tsx` and `src/config/index.ts`.
All top level statements will also be executed during this module loading.
This is true for the following in this order:

1. Environment configuration `src/config/env.ts`
2. i18n configuration `src/config/i18n/index.ts`
3. axios configuration `src/config/index.ts`

Map is nested the following way:

- `MapWrapper` most outer, for all layers
- `Map` contains toolbar etc.
- `BaseStage` is the stage of Konva, i.e., the first Konva component and all other components are children

## Helpful Links

React:

- [React Visualized](https://react.gg/visualized)
- [The new React documentation (as of 16.03.2023)](https://react.dev/learn)
- [Advanced and detailed blog](https://kentcdodds.com/blog?q=react)

Frontend Architecture:

- [Modularizing React Applications](https://martinfowler.com/articles/modularizing-react-apps.html)

Zustand (Global State Management):

- [Tutorial](https://blog.logrocket.com/managing-react-state-zustand/)
- [The Zustand documentation](https://github.com/pmndrs/zustand)

React Query (Server State Management):

- [Quick Start](https://tanstack.com/query/v4/docs/react/quick-start)
- [Blog Of The Maintainer](https://tkdodo.eu/blog/all)

Storybook:

- [How to structure a storybook](https://storybook.js.org/blog/structuring-your-storybook/)
