# PermaplanT

[![Build Status](https://build.libelektra.org/job/PermaplanT/job/master/lastBuild/badge/icon)](https://build.libelektra.org/job/PermaplanT/job/master/lastBuild/)
[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/ElektraInitiative/PermaplanT)

[PermaplanT](https://www.permaplant.net) is a web app for planning permaculture.

## Client Requirements

- Browsers: Firefox, Chromium, Safari, Vivaldi
- RAM: >4GB for small places, >8GB for larger places

## Documentation

Start reading in [/doc/architecture/README.md](/doc/architecture/README.md).
The documentation is best viewed by running the following commands in the projects root folder:

```sh
make run-mdbook
```

Which will open [/doc/architecture/README.md](/doc/architecture/README.md) as first page.

## Makefile commands

Type `make help` to see all commands.
The Makefile consists of frequently used workflows.
For more detailed executions have a look inside the specific subfolders.

**Some of the commands require env variables to be set.
Have a look at [backend env variables](./doc/backend/01setup.md), [frontend env variables](./frontend/README.md) and [scraper env variables](./scraper/README.md)**

Important links:

- [Web API Documentation](https://www.permaplant.net/doc/api/swagger/ui/)

## Community and Contributing

PermaplanT is developed by [us](./doc/authors.md) and by users like you.
We welcome both pull requests and issues on GitHub.
Check out the [contributing docs](.github/CONTRIBUTING.md).

Information about developing can be found under [our development setup](./doc/development_setup.md).
