# Contributing to PermaplanT

If you are new, it is probably best if you first [write us](mailto:contact@permaplant.net).

# Reporting a bug

If you encounter a bug feel free to fill out our [bug report form](https://github.com/ElektraInitiative/PermaplanT/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml).

If you find mistakes in the docs you can just submit a pull request with a fix.

# Development

## Hooks

The project uses [pre-commit](https://pre-commit.com/index.html#filtering-files-with-types) hooks to ensure a consistent style is used.

### Setup

1. [Install pre-commit](https://pre-commit.com/index.html#intro) via `pip` or the package manager of you choice.
2. If you had husky installed before make sure to remove preexisting hooks. `git config --unset core.hooksPath`
3. Run `pre-commit install`.

## Sub-Projects

You can find more info on the development process here:

- [Frontend](https://github.com/ElektraInitiative/PermaplanT/tree/master/doc/contrib/frontend.md)
- [Backend](https://github.com/ElektraInitiative/PermaplanT/tree/master/doc/contrib/backend.md)
