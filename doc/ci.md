# CI/CD Pipeline

## Triggers

The pipeline will be executed for every Pull Request and every push to the repository.

If you want the pipeline to be executed again on a Pull Request, you can add a comment saying `jenkins build please`.
This will most likely be the case if you suspect that something is wrong with the build server infrastructure.
If problems persist, please create a new issue with the failing build log.

For users with login credentials for Jenkins, you can manually execute the pipeline for a branch or pull request via the [Jenkins UI](https://build.libelektra.org).
Please ask if you want to have login data.

## Stages

### Prerequisites (Schema)

Before we can actually execute checks or build the binaries, we need `schema.rs` and `definitions.ts`.

These can be automatically created with `./ci/build-scripts/build-schema.sh`.

### Checks

Checks will run against the codebase in parallel according to the definition inside `./ci/Jenkinsfile` (scripted pipeline).

These tasks will be run inside docker containers.
Backend will be checked against a sidecar-container running PostgreSQL.

### Build

Every pull request will be built and tested against a separate CI database.

Steps for all PRs are:

- prepare an empty PostgreSQL database with the PostGIS extension installed
- call `./ci/build-scripts/build-backend.sh`, which builds the rust binary as well as the bindings' definition via `typeshare`
- call `./ci/build-scripts/build-frontend.sh`, which does a full release build of the frontend

### Deploy to PR Environment

Every pull request will be deployed on a publicly available instance on [pr.permaplant.net](https://pr.permaplant.net).

Since there is only one agent for PRs available, the last built PR wins.

### Deploy to Dev Environment

The `master` branch will be automatically deployed to [dev.permaplant.net](https://dev.permaplant.net).

### Deploy to Prod Environment

The production environment is available on [www.permaplant.net](https://www.permaplant.net).
Deployment to production will not happen automatically.
