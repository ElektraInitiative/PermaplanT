# CI/CD Pipeline

## Prerequisites (Schema)

Before we can actually execute checks or build the binaries, we need `schema.rs` and `definitions.ts`.

These can be automatically created with `./ci/build-scripts/build-schema.sh`.

## Checks

Checks will run against the codebase in parallel according to the definition inside `./ci/Jenkinsfile` (scripted pipeline).

These tasks will be run inside docker containers. Backend will be checked against a sidecar-container running Postgres.

## Build

Each and every pull request will be built and tested against a separate CI database.

Steps for all PRs are:

* prepare an empty Postgres database
* call `./ci/build-scripts/build-backend.sh`, which builds the rust binary as well as the bindings' definition via `typeshare`
* call `./ci/build-scripts/build-frontend.sh`, which does a full release build of the frontend

## Deploy to PR Environment

Each and every pull request will be deployed on a publicly available instance on [pr.permaplant.net](pr.permaplant.net).

Since there is only one PR Environment available, the last built PR wins.

## Deploy to Dev Environment

The `master` branch will be automatically deployed to [dev.permaplant.net](dev.permaplant.net).
