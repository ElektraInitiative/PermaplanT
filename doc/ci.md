# CI/CD Pipeline

## Triggers

The pipeline will be executed **only** for pushes to Pull Requests and for pushes to master.

If the pipeline fails and you think it is not the fault of your code, you can re-execute the pipeline by typing `jenkins build please` as a comment.
If problems persist, please create a new issue with the failing build log.

For users with login credentials for Jenkins, you can manually execute the pipeline for a branch or pull request via the [Jenkins UI](https://build.libelektra.org/job/PermaplanT/).
Please ask if you need login data.

## Concurrent Builds

Concurrent builds on the same branch are disabled.
The master branch is excluded from this rule.

## Stages

### Sanity stage

This stage performs rapid checks like pre-commit, migrations and schema building.

Local pre-commit currently does not perform the codespell hook, but it is performed in the pipeline.
Cargo fmt, eslint and groovy linting is not performed through pre-commit.

### Tests and Build

This is a parallel stage which fails fast (exits if one stage fails) or times out after 2 hours.

It can be subdivided in 3 categories:

#### Multiple parallel cargo stages

Standard cargo build, clippy, doc and test is performed here.

#### One sequential frontend stages

Frontend is built, tested, linted, format checked and additionally package.json version is verfied to be up to date.
Storybook and typedocs are also generated here.

#### One sequential mdbook stages

Mdbook is built, tested and links are checked.

### Deploy PR

Every pull request will be deployed on a publicly available instance on [pr.permaplant.net](https://pr.permaplant.net).
Jenkins will acquires a lock before deploying to pr.permaplant.net and release it after finishing the E2E stage.
This lock prevents other jobs to overwrite the deployment while we are performing E2E tests.

Since there is only one agent for PRs available, the last built PR wins.

### E2E Tests

E2E tests are run on [dev.permaplant.net](https://dev.permaplant.net).
If a test times out, it is retried.

[Test reports and results](https://build.libelektra.org/job/PermaplanT/job/master/lastCompletedBuild/artifact/e2e/) are generated on successful execution.
They contain videos, screenshots and a html report.
There is also a [cucumber report](https://build.libelektra.org/job/PermaplanT/job/master/lastCompletedBuild/cucumber-html-reports/overview-features.html).

### Deploy Dev

The `master` branch will be automatically deployed to [dev.permaplant.net](https://dev.permaplant.net).

### Deploy Prod

This stage is only manually executable through [Jenkins](https://build.libelektra.org/job/PermaplanT-Release/).
There is a separate Jenkinsfile (`/ci/Jenkinsfile.release`)for this containing build and deploy stages only (no testing).

Production is deployed to [www.permaplant.net](https://www.permaplant.net).

See [release.md](./release.md) for the manual release procedure.
