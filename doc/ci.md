# CI/CD Pipeline

## Pull Requests

Each and every pull request will be built and tested against a separate CI database.

Steps for all PRs are:

* prepare a new postgres database
* call `./ci/build-scripts/build-backend.sh`, which builds the rust binary as well as the bindings' definition via `typeshare`
* call `./ci/build-scripts/build-frontend.sh`, which does a full release build of the frontend
