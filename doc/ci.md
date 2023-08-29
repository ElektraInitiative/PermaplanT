# CI/CD Pipeline

## Triggers

The pipeline will be executed **only** for pushes to Pull Requests and for pushes to master.

If the pipeline fails and you think it is not the fault of your code, you can re-execute the pipeline by typing `jenkins build please` as a comment.
If problems persist, please create a new issue with the failing build log.

For users with login credentials for Jenkins, you can manually execute the pipeline for a branch or pull request via the [Jenkins UI](https://build.libelektra.org/job/PermaplanT/).
Please ask if you need login data.

## Succeeding Pushes

If you push to branches:

- Only the newest commit will be built.
  It does not matter if commits in between would pass.
- Builds of older pushes are aborted.
- Also `jenkins build please` will abort previous builds and start the build again.
- The latest PR build job will stay deployed on (https://pr.permaplant.net).
- The [master branch](https://github.com/ElektraInitiative/PermaplanT/commits/master) is excluded from these rules.

## Stages

### Sanity stage

This stage performs rapid checks like pre-commit, migrations and schema building.

Local pre-commit currently does not perform the codespell hook, but it is performed in the pipeline.
Cargo fmt, eslint and groovy linting is not performed through pre-commit.

### Tests and Build

This is a parallel stage which fails fast (exits if one stage fails) or times out after 2 hours.

It can be subdivided in following categories:

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

E2E tests are run on [pr.permaplant.net](https://pr.permaplant.net).
When a test times out, it is retried up to two times with a five second delay between retries.

Test reports and results can be found in the jobs [artifacts](https://build.libelektra.org/job/PermaplanT/job/master/lastCompletedBuild/artifact/e2e/).

Failed tests will generate videos and/or screenshots inside `e2e/test-results/` in the jobs [artifacts](https://build.libelektra.org/job/PermaplanT/job/master/lastCompletedBuild/artifact/e2e/), depending on what failed.
The videos have to be downloaded to be viewed.

There is always a html report inside `e2e/test-reports/` in the jobs [artifacts](https://build.libelektra.org/job/PermaplanT/job/master/lastCompletedBuild/artifact/e2e/) and a [cucumber report](https://build.libelektra.org/job/PermaplanT/job/master/lastCompletedBuild/cucumber-html-reports/overview-features.html) on a separate page.

### Deploy Dev

The `master` branch will be automatically deployed to [dev.permaplant.net](https://dev.permaplant.net).

### Deploy Prod

There is a separate Jenkinsfile (`/ci/Jenkinsfile.release`) for this pipeline, which is only manually executable through [Jenkins](https://build.libelektra.org/job/PermaplanT-Release/).
It runs only build and deploying stages (no testing).

Production is deployed to [www.permaplant.net](https://www.permaplant.net).

See [release.md](./release.md) for the manual release procedure.
