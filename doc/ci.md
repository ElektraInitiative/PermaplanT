# CI/CD Pipeline

## Triggers

The pipeline will be executed ONLY for pushes to Pull Requests.

If you want the pipeline to be executed, you can add a comment saying `jenkins build please`.
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

- Parallel cargo stages
- Sequential frontend stages
- Sequential mdbook stages

Following `hidden` checks are done:

- Package.json version is checked to be up to date.
- Mdbook links are checked for their validity.

### Deploy PR

Every pull request will be deployed on a publicly available instance on [pr.permaplant.net](https://pr.permaplant.net).
Jenkins will acquires a lock here and releases it after finishing the E2E tests.

Since there is only one agent for PRs available, the last built PR wins.

### E2E Tests

E2E tests are run on [dev.permaplant.net](https://dev.permaplant.net).
If a test timeouts it is retried.

Test reports and results are generated after successful execution.

- A [cucumber report](https://build.libelektra.org/job/PermaplanT/job/master/lastCompletedBuild/cucumber-html-reports/overview-features.html)
- A [html report](https://build.libelektra.org/blue/organizations/jenkins/PermaplanT/detail/master/395/artifacts)
- Videos and screenshots can on failed tests can also be found where the html report is

### Deploy Dev

The `master` branch will be automatically deployed to [dev.permaplant.net](https://dev.permaplant.net).

### Deploy Prod

There is a separate Jenkinsfile (`/ci/Jenkinsfile.release`) for production deployments.
It can only be manually triggered inside Jenkins ([here](https://build.libelektra.org/job/PermaplanT-Release/)).

This Jenkinsfile only executes the necessary build steps (no checks) and deploys to the production server.

The production environment is available on [www.permaplant.net](https://www.permaplant.net).
