# PermaplanT Frontend

## Requirements

- nodejs 20 ([Installation guide](../doc/development_setup.md))
- npm v10

## Installation and Usage

1. Install dependencies

```shell
npm install
```

2. Generate backend types via TypeShare.
   Make sure that the typeshare-cli is installed in the backend.

```shell
npm run generate-api-types
```

3. Create '.env' file and copy content from '.env.sample'.
   Modify env variables to fit the environment.

```shell
cp .env.sample .env
```

4. Start development server

```shell
npm run dev
```

This will start the development server on [http://localhost:5173/](http://localhost:5173/) and will open the application in your default web browser.
The server will automatically reload the page when you make changes to the code.

## Documentation

To view the documentation

1. Generate the documentation via TypeDoc.

```shell
npm run doc
```

2. Start storybook

```shell
npm run storybook
```

This will start the storybook dev server on [http://localhost:6006/](http://localhost:6006/) and will open it up on your default web browser.

## Testing

1. Make sure you are in the frontend directory
2. Run the test script

```shell
npm run test
```

### Testing individual files

```shell
npm run test -- path/to/component.test.tsx
```

### Watch mode

Our test framework provides an interactive watch mode that can be executed with

```shell
npm run test -- --watchAll
```

This command starts an interactive CLI that can be used to rerun specific tests after implementing changes.

## Production

To build the application for production, run:

```shell
npm run build
```

By default, the build output will be placed at `dist`.

To view the build locally, run:

```shell
npm run preview
```

## Type Safety

In order to ensure type safety between the TypeScript frontend and Rust backend, we use [typeshare](https://github.com/1Password/typeshare) to synchronize our Rust type definitions with TypeScript.
These types are auto-generated and we can find our rust-typescript bindings under `/src/bindings` and use them directly in our TypeScript codebase.

## Developing and testing Nextcloud features

In order to avoid CORS issues disable your browsers CORS checks.
In chromium they can be disabled by starting it with:

```
chromium --disable-web-security --user-data-dir="[some directory here]"
```

This is necessary because Nextcloud has a strict CORS policy and there is no way to allow certain origins.
This limitation means that the PermaplanT app and the used Nextcloud instance have to run on the some domain.

Firefox does not seem to have an easy way to do the same, see https://bugzilla.mozilla.org/show_bug.cgi?id=1039678
