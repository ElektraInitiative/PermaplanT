# PermaplanT Backend

## Requirements

- nodejs 19.4.0
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

3. Start development server

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
