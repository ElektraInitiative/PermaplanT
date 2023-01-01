# Frontend Bundler

## Problem

We need to choose a module bundler for the React frontend of our application that bundles various types of assets, such as JavaScript, CSS, and images, into a single package that can be efficiently loaded by the browser.

## Constraints

- The bundler must provide optimization features such as [tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) to reduce bundle size.
- The bundler must have good documentation and a large community of users.
- The bundler should provide good performance and fast build times.

## Assumptions

- The bundler's learning curve will not be too steep for the development team.
- The bundler will not add unnecessary bloat to the app.

## Considered Alternatives

- Webpack: [Webpack](https://webpack.js.org/) is a popular and widely-used bundler that has good support for React. It has a large plugin ecosystem and can handle a wide range of use cases. However, it can have a steep learning curve and may require a lot of configuration to set up.
- Rollup: [Rollup](https://rollupjs.org/guide/en/) is a bundler that is focused on providing efficient tree-shaking and code-splitting to reduce bundle size. It has a simpler configuration than Webpack and a good support community.
- Parcel: [Parcel](https://parceljs.org/) is a newer bundler that is known for its simplicity and fast performance.

## Decision

We will use [Vite](https://vitejs.dev/) as the bundler for the React frontend of our application.

## Rationale

In general, Vite offers a faster and more efficient development experience.
It serves individual ES modules to the browser during development, allowing it to start up nearly instantly.
[Hot Module Replacement](https://vitejs.dev/guide/features.html#hot-module-replacement)(HMR) only needs to replace one small file instead of rebundling the entire app, making rebuilds quick.
Vite also uses Rollup underneath for production builds to perform an aggressive dead-code elimination (tree shaking), which in general results in smaller bundle sizes.

## Implications

## Related Decisions

## Notes
