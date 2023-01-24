# Contributing to Frontend

## Hooks

The frontend uses pre-commit hooks to ensure certain actions such as linting will be done before a commit succeeds.
To enable this, make sure to set the right permissions:

```shell
chmod ug+x .husky/*
```

## Type Safety

In order to ensure type safety between the TypeScript frontend and Rust backend, we use [typeshare](https://github.com/1Password/typeshare) to synchronize our Rust type definitions with TypeScript.
Make sure that the typeshare-cli is installed in the backend.

```shell
npm run generate-api-types
```

Now we can find our rust-typescript bindings under `/src/bindings` and use them directly in our TypeScript codebase.
