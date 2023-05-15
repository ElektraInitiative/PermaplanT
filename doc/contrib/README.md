# Contributing to PermaplanT

If you are new, it is probably best if you first [write us](mailto:contact@permaplant.net).

# Reporting a bug

If you find a bug in the code or a mistake in the documentation, you can help us by submitting an issue to our [issue tracker](https://github.com/ElektraInitiative/PermaplanT/issues) or you can submit a Pull Request with a fix.

- If you encounter a bug then please make sure to include the following information:
  - The version of the code you were using.
  - A clear and concise description of the problem.
  - A minimal, self-contained code sample that reproduces the problem (if possible).
  - Information about the environment in which the problem occurs (e.g. operating system, version of Rust, version of Diesel, etc.)

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
