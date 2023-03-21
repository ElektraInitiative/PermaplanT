# PermaplanT Frontend

## Requirements

- nodejs 19.4.0 ([Installation guide](../doc/development_setup.md))
- npm

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

3. Create .env file and copy content from sample_env.
   Modify env variables to fit the environment.

```shell
cp sample_env .env
```

4. Start development server

```shell
npm run dev
```

This will start the development server on <http://localhost:5173/> and will open the application in your default web browser. The server will automatically reload the page when you make changes to the code.

To test that it is working, you can visit this url on your preferred browser: <http://localhost:5173/seeds>

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
