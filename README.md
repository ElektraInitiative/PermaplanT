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

## Makefile commands

Following commands exists:

`run, test, build, clean`

Following entities exist:

`frontend, backend, mdbook, storybook`

You can construct your commands now, e.g `run-backend`, `test-mdbook`, `build-storybook` or `clean-backend`

Additional commands:

| Command              | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `all`                | Run all tests and build everything                                                            |
| `generate-api-types` | Generates TypeScript bindings                                                                 |
| `psql-r`             | Connects to the PostgreSQL on port 5432 as db_user permaplant and db_name permaplant remotely |
| `pre-commit-all`     | Runs pre-commit hooks on all files                                                            |
| `install`            | Install necessary packages                                                                    |
| `uninstall`          | Uninstall the packages installed with install                                                 |
| `distclean`          | Clean and uninstall                                                                           |

**SOME OF THESE COMMANDS REQUIRE ENV VARIABLES TO WORK, LOOK AT [backend env variables](./doc/backend/01setup.md) or [frontend env variables](./frontend/README.md)**

Important links:

- [Web API Documentation](https://www.permaplant.net/doc/api/swagger/ui/)
