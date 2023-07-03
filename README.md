# PermaplanT

[![Build Status](https://build.libelektra.org/job/PermaPlanT-Folder/job/PermaplanT/job/master/lastBuild/badge/icon)](https://build.libelektra.org/job/PermaPlanT-Folder/job/PermaplanT/job/master/lastBuild/)
[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/ElektraInitiative/PermaplanT)

[PermaplanT](https://www.permaplant.net) is an app for

- Web: Firefox, Chromium
- Larger mobile devices like tablets: Progressive Web App (PWA) Android 9+

## Documentation

Start reading in [/doc/architecture/README.md](/doc/architecture/README.md).
The documentation is best viewed by running the following commands in the projects root folder:

```sh
make run-mdbook
```

Which will open [/doc/architecture/README.md](/doc/architecture/README.md) as first page.

## All Makefile commands

| Command              | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `all`                | Runs all tests and builds everything                                                           |
| `run-frontend`       | Builds the frontend and runs the development server                                            |
| `run-backend`        | Builds the backend and runs the backend server                                                 |
| `run-mdbook`         | Builds mdbook and serves it with live reload                                                   |
| `run-storybook`      | Installs dependencies and runs Storybook for the frontend                                      |
| `test`               | Runs static tests and tests for the frontend, backend, and mdbook                              |
| `test-frontend`      | Installs dependencies, checks formatting, lints, and runs tests for the frontend               |
| `test-backend`       | Runs tests for the backend                                                                     |
| `test-mdbook`        | Runs tests for mdbook                                                                          |
| `test-storybook`     | Installs dependencies and runs Storybook for the frontend                                      |
| `build`              | Builds bindings, frontend, backend, Storybook, and mdbook                                      |
| `build-frontend`     | Builds bindings, installs dependencies, generates API types, and builds the frontend           |
| `build-backend`      | Installs diesel_cli and typeshare_cli, sets up diesel, runs migrations, and builds the backend |
| `build-mdbook`       | Installs mdbook and mdbook plugins, and builds mdbook                                          |
| `build-storybook`    | Installs dependencies and builds Storybook for the frontend                                    |
| `generate-api-types` | Generates TypeScript bindings for the backend                                                  |
| `psql-r`             | Connects to the PostgreSQL on port 5432 as db_user permaplant and db_name permaplant remotely  |
| `pre-commit-all`     | Runs pre-commit hooks on all files                                                             |
| `clean`              | Cleans frontend, backend, mdbook and storybook                                                 |
| `clean-frontend`     | Removes frontend dependencies                                                                  |
| `clean-backend`      | Cleans the backend                                                                             |
| `clean-mdbook`       | Cleans the mdbook folder                                                                       |
| `clean-storybook`    | Cleans the storybook folder                                                                    |

Important links:

- [Web API Documentation](https://www.permaplant.net/doc/api/swagger/ui/)
