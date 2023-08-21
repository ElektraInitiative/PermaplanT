# Contributing to PermaplanT

## Getting Started

Before you start anything, please make sure you:

- skimmed the mdbook (`make run-mdbook`), especially the chapters listed in "Architecture", including:
  - [ ] use cases
  - [ ] guidelines
  - [ ] decisions
- also have a look at other documentations:
  - [ ] [API](../backend/03api_documentation.md)
  - [ ] Storybook (`make run-storybook`)
- report all problems you found during getting started, as it is essential that entry barriers get reduced

For any non-trival work, i.e., not only trivial fixes/updates in documentation or tests, there should be an underlying issue.
You can create such issues yourself.
Before you work on it, make sure the issue is:

- clear enough described,
- assigned to you and
- ["In Progress" in our project](https://github.com/orgs/ElektraInitiative/projects/4).

## Reporting a bug

If you find a bug in the code or a mistake in the documentation, you can help us by submitting an issue to our [issue tracker](https://github.com/ElektraInitiative/PermaplanT/issues) or you can submit a Pull Request with a fix.

If you encounter a bug then please make sure to include the following information:

- The version of the code you were using.
- A clear and concise description of the problem.
- A minimal, self-contained code sample that reproduces the problem (if possible).
- Information about the environment in which the problem occurs (e.g. operating system, version of Rust, version of Diesel, etc.)

## [Pre-requisites](../development_setup.md#prerequisites)

## Development

The project uses [pre-commit](https://pre-commit.com/index.html#filtering-files-with-types) hooks to ensure a consistent style.

1. [Install pre-commit](https://pre-commit.com/index.html#intro) via `pip` or the package manager of you choice.
2. If you had husky installed before make sure to remove preexisting hooks. `git config --unset core.hooksPath`
3. Run `pre-commit install`.

## Getting PRs merged

Once you created a PR, please request reviews, including also from @markus2330, who will usually also merge.

Please make sure you fulfilled all basics of PRs.

Commit messages should fulfill:

- The first line in commit messages should be short.
- From the third line you can have more elaborate descriptions of the changes.
- Please refer to #issues/#PRs/@mention as useful, including closing your issues.

Branch names should be one of:

- feature/<issue_nr>
- bug_fix/<issue_nr>
- documentation/<name>
- meeting_notes/<date>
- release/<version>

If requested, and in any case before you start making fundamental changes, create a [decision](../../doc/decisions/) before creating a code PR.

## Documentation

We have following pieces of documentation:

1. General information should be in the mdbook.
2. For the REST API we use utopia/swagger (in the backend).
3. For the backend we use `cargo doc`.
4. For the frontend we use storybook.

## Sub-Projects

You can find more info on the development process here:

- [Frontend](https://github.com/ElektraInitiative/PermaplanT/tree/master/doc/contrib/frontend.md)
- [Backend](https://github.com/ElektraInitiative/PermaplanT/tree/master/doc/contrib/backend.md)
