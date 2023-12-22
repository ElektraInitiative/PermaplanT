# Frontend Documentation

## Problem

We need to choose a workflow, tooling that helps us to keep the documentation up to date.
An easy-to-read and up-to-date documentation reduces the entry barrier for newcomers.
Without proper documentation maintenance becomes increasingly more difficult as the project grows.

## Constraints

1. The documentation should be easy to navigate.
2. The documentation should, for the most part, be automatically extracted from the source code.
3. The documentation should be searchable.

## Assumptions

1. With a good and beautiful documentation tool, developers are more likely to use and maintain it.
2. With a documentation tool that enables the viewing of react components, the code quality is improved.
3. The rules about component design in [contrib/frontend](../contrib/frontend.md#component-design) are followed.
4. With an overview of all presentation components, the whole team can instantly see what is available.

## Considered Alternatives (documentation extraction)

- API-Extractor: [API-Extractor](https://api-extractor.com/) is a tool to extract the public API of a typescript project. It is more suited for libraries.
- React Docgen: [React Docgen](https://github.com/reactjs/react-docgen) is a tool from the React Community to extract information from React Components for documentation generation purposes.

  - It is not actively maintained anymore.
  - It does not generate markdown files, so an additional step is needed, to get just the most basic information.

- JSDoc: [JSDoc](https://jsdoc.app/) is an API documentation generator for JavaScript.
  It is more suited for JavaScript.

## Decision

We will use [TypeDoc](https://typedoc.org/) with the markdown plugin to extract documentation from the source code.

## Rationale

- TypeDoc has automatic support for most tags of JSDoc via the TypeScript compiler.
- Additional tags are supported as well.
- It is easy to configure and invoke.
- It is extensible via plugins.

## Considered Alternatives (viewing components)

- React Styleguidist: [React Styleguidist](https://react-styleguidist.js.org/)
  Is a popular and maintained solution to develop a project-wide style guide in React.
  It has fewer features than Storybook.
  It is hard to setup, as it assumes the usage of Create React App.
- Docusaurus: [Docusaurus](https://docusaurus.io/)
  Is a popular solution for generating static documentation websites.
  It is more targeted towards manually written documentation and has less features specifically targeting how a component should be used.

## Decision

We will use [Storybook](https://storybook.js.org/) to enable a project-wide component overview and style guide.
It has support for `MDX`, a format that enables embeddable components in Markdown.
It has support for automated testing via `Vitest` and `Playwright`.

## Rationale

With Storybook the extracted documentation from TypeDoc can viewed as standalone documentation pages.
It works well with Vite and is relatively easy to setup.

## Implications

- To install storybook a `.npmrc` file with `legacy-peer-deps=true` is required.
  This causes npm to behave like in version 6, not installing peer-dependencies automatically.
  This should not cause any problems down the line, but storybook could be extracted into it's own package, with more configuration involved.

- A little plugin needs to be developed to link `Storybook` and the extracted markdown files from `TypeDoc` automatically.

## Related Decisions

## Notes

### Notes about embedded markdown

Without the plugin, we will need to write a `.mdx` file for each extracted markdown file.
Also links inside the markdown will not work without the plugin.

```jsx
import Md from './docs/enums/bindings_definitions.Quality.md';
import './markdown.css';
import { Description, Meta } from '@storybook/addon-docs/blocks';
import React from 'react';

<Meta
  title="Enumeration: Quality"
  parameters={{
    viewMode: 'docs',
    previewTabs: {
      canvas: { hidden: true },
    },
  }}
/>

<Md />
```

### How to structure a storybook

https://storybook.js.org/blog/structuring-your-storybook/
