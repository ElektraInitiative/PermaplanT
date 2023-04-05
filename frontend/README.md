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

3. Create '.env' file and copy content from '.env.sample'.
   Modify env variables to fit the environment.

```shell
cp .env.sample .env
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

## Internationalization

For internationalization we use [react-i18next](https://react.i18next.com/latest/usetranslation-hook), which is a powerful framework to provide translation functionality and more.
The translations live in the `src/config/i18n` directory together with the respective `i18next` configuration.
We use a feature-based translation approach.
Each language has its own folder which holds all translations in files that are named like the features under `src/features`.
In case a translation is more common there is an additional common namespace defined.
The translations are loaded from JSON modules to enable type safety.
For this there is a special file `@types/i18next.d.ts`.

If you want to translate a string living in feature `seeds`, follow this schema:

```tsx

function ComponentInFeatureSeeds() {
    // load the translation namespaces 'seeds' and 'common'
    const { t } = useTranslation(['seeds', 'common'])

    // use the t function to translate some key of feature 'seeds' and 'common'
    // use <Suspense> to wait for the data fetching of useTranslation
    return (
        <Suspense>
            <div>{t('common_key')}</div>
            <div>{t('seeds:key_of_feature_seeds')}</div>
        </Suspense>
    );
}

```
