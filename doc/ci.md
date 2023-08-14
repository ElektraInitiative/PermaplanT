# CI/CD Pipeline

## Triggers

The pipeline will be executed for every Pull Request and every push to the repository.

If you want the pipeline to be executed again on a Pull Request, you can add a comment saying `jenkins build please`.
This will most likely be the case if you suspect that something is wrong with the build server infrastructure.
If problems persist, please create a new issue with the failing build log.

For users with login credentials for Jenkins, you can manually execute the pipeline for a branch or pull request via the [Jenkins UI](https://build.libelektra.org).
Please ask if you want to have login data.

## Cancel Concurrent Builds

Previous builds on the same branch will get aborted to save computing time on the nodes.
The master branch is excluded from this rule.

## Stages

### Prerequisites (Schema)

Before we can actually execute checks or build the binaries, we need `schema.rs` and `definitions.ts`.

These can be automatically created with `./ci/build-scripts/build-schema.sh`.

### Tests & Build

This is a parallel stage that has a 2 hour timeout and exits if one substage fails.
It checkouts the current codebase and each stage runs inside a separate docker container.

Following substages exist:

- Test and Build Mdbook
- Test and Build Backend (With PostGIS sidecar container)
- Test and Build Frontend

For more information about automated integration tests look [here](./tests/README.md).

Every pipeline run has its own isolated database.

Steps for all PRs are:

- prepare an empty PostgreSQL database with the PostGIS extension installed
- call `./ci/build-scripts/build-backend.sh`, which builds the rust binary as well as the bindings' definition via `typeshare`
- call `./ci/build-scripts/build-frontend.sh`, which does a full release build of the frontend

### Deploy to PR Environment

Every pull request will be deployed on a publicly available instance on [pr.permaplant.net](https://pr.permaplant.net).

Since there is only one agent for PRs available, the last built PR wins.

### E2E Tests

After deploying to PR, we are performing E2E tests on `dev.permaplant.net`.
To make sure the current deployment on PR does not change, Jenkins acquires a lock before deploying and releases it after finishing the tests.

Test reports and results are generated after successful execution.
This is a [Cucumber report](https://build.libelektra.org/job/PermaplanT/job/master/385/cucumber-html-reports/overview-features.html) and the html report can be found inside the [job artifacts](https://build.libelektra.org/blue/organizations/jenkins/PermaplanT/detail/master/385/artifacts).

### Deploy to Dev Environment

The `master` branch will be automatically deployed to [dev.permaplant.net](https://dev.permaplant.net).

### Deploy to Prod Environment

There is a separate Jenkinsfile (`/ci/Jenkinsfile.release`) for production deployments.
It can only be manually triggered inside Jenkins ([here](https://build.libelektra.org/job/PermaplanT-Release/)).

This Jenkinsfile only executes the necessary build steps (no checks) and deploys to the production server.

The production environment is available on [www.permaplant.net](https://www.permaplant.net).
