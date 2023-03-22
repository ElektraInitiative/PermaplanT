# CI/CD Pipeline

## Restrictions

The following restrictions apply:

- We cannot build frontend and backend in parallel.
  - frontend depends on backend (`typeshare` definition)
  - we can only build them sequentially (`backend` > `typeshare` > `frontend`)
- we cannot build without a database
  - due to diesel

## Pull Requests

Each and every pull request will be built and tested against a separate CI database.

Steps for all PRs are:

* prepare an empty Postgres database
* call `./ci/build-scripts/build-backend.sh`, which builds the rust binary as well as the bindings' definition via `typeshare`
* call `./ci/build-scripts/build-frontend.sh`, which does a full release build of the frontend

It will be available for public access on [pr.permaplant.net](pr.permaplant.net).

## Dev Environment

The `master` branch will be automatically deployed to [dev.permaplant.net](dev.permaplant.net).
