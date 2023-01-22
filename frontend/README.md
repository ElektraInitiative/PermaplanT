# PermaplanT Backend

## Requirements

- node 19.4.0

## Installation and Usage

1. Install dependencies

```shell
npm install
```

2. Start development server

```shell
npm run dev
```

This will start the development server on <http://localhost:5173/> and will open the application in your default web browser. The server will automatically reload the page when you make changes to the code.

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

## Development

### Hooks

The frontend uses pre-commit hooks to ensure certain actions such as linting will be done before a commit succeeds.
To enable this, make sure to set the right permissions:

```shell
chmod ug+x .husky/*
```

### Type Safety

In order to ensure type safety between the TypeScript frontend and Rust backend, we use [typeshare](https://github.com/1Password/typeshare) to synchronize our Rust type definitions with TypeScript.
Make sure that the typeshare-cli is installed in the backend.

```shell
npm run generate-api-types
```

Now we can find our rust-typescript bindings under `/src/bindings` and use them directly in our TypeScript codebase.
