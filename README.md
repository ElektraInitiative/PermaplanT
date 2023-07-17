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

Type `make help` to see all commands`

**SOME OF THESE COMMANDS REQUIRE ENV VARIABLES TO WORK, LOOK AT [backend env variables](./doc/backend/01setup.md) or [frontend env variables](./frontend/README.md)**

Important links:

- [Web API Documentation](https://www.permaplant.net/doc/api/swagger/ui/)

## Community and Contributing

PermaplanT is developed by [us](./doc/authors.md) and by users like you. We welcome both pull requests and issues on GitHub.
Check out the [contributing docs](.github/CONTRIBUTING.md).

Information about developing can be found under [our development setup](./doc/development_setup.md).
