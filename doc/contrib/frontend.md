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

We use Storybook [Storybook](https://storybook.js.org) to document shared components.
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

## Bootstrapping (Order of Execution)

The entry point for the frontend is `src/main.tsx`.
From there three modules get imported `src/Root.tsx`, `src/App.tsx` and `src/config/index.ts`.
All top level statements will also be executed during this module loading.
This is true for the following in this order:

1. Environment configuration `src/config/env.ts`
2. i18n configuration `src/config/i18n/index.ts`
3. axios configuration `src/config/index.ts`

## Internationalization

For internationalization we use [react-i18next](https://react.i18next.com/latest/usetranslation-hook), which is a powerful framework to provide translation functionality and more.

### Language Detection

On the initial page load the language gets detected from the browser settings.
English is the fallback language if none of our currently supported languages (English, German) could be detected.
This language is then persisted into local storage.
The language switcher in the navigation bar also persists the chosen language to local storage.
On any further page load this persisted language is used.

### Structure

We use a feature-based translation approach.

- The translations live in the `/src/config/i18n` directory together with the respective `i18next` configuration.
- Each language has its own folder which holds all translations in files that are named like the features under `/src/features`.
  E.g. for the `seeds` feature there is a translation file in `/src/config/i18n/seeds.json`

- The feature's translation file should be structured like this:

```json
{
  "foo_component": {
    "title": "Foo",
    ...
  },
  "bar_component": {
    "title": "Bar",
    ...
  },
  "common_key_inside_the_feature": "A mere commoner",
  ...
}
```

- In case a translation does not fit into any feature there is an additional common namespace `common.json` defined.
  E.g. for general error messages.

- Shared components like a button usually also want to render some text.
  In this case the text should be translated inside the respective feature where the button is used.
  E.g. the create seed button inside the `seeds` feature:

```json
// seeds.json
{
  // CreateSeed component
  "create_seed": {
    "btn_create_seed": "Create Seed"
  }
}
```

### How To

If you want to translate a string, for example from the `seeds` feature in the `CreateSeed` component, follow this schema:

- a whole translation key is structured like this `<namespace>:<component>.<part>`

```tsx
function CreateSeed() {
  // load the translation namespaces 'seeds' and 'common'
  const { t } = useTranslation(["seeds", "common"]);

  // this is just an example
  const hasError = false;

  // wrap in <Suspense> to wait for the data fetching of useTranslation
  // use the t function to translate a key of namespace 'seeds' and 'common'
  return (
    <Suspense>
      {hasError ? (
        <div>{t("common:unknown_error")}</div>
      ) : (
        <button>{t("seeds:create_seed.btn_create_seed")}</button>
      )}
    </Suspense>
  );
}
```

### Type Safe Keys

The translations are loaded from JSON modules to enable type safety.
For this there is a special file `@types/i18next.d.ts`.
Because it is impossible to type based on the chosen language, only the types of the fallback language `en` are defined.

## Helpful Links

React:

- [React Visualized](https://react.gg/visualized)
- [The new React documentation (as of 16.03.2023)](https://react.dev/learn)
- [Advanced and detailed blog](https://kentcdodds.com/blog?q=react)

Zustand (Global State Management):

- [Tutorial](https://blog.logrocket.com/managing-react-state-zustand/)
- [The Zustand documentation](https://github.com/pmndrs/zustand)

React Query (Server State Management):

- [Quick Start](https://tanstack.com/query/v4/docs/react/quick-start)
- [Blog Of The Maintainer](https://tkdodo.eu/blog/all)

Storybook:

- [How to structure a storybook](https://storybook.js.org/blog/structuring-your-storybook/)
