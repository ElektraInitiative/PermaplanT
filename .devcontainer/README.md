# VS Code Devcontainer for PermaplanT

## Overview

Please note that most of these instructions are derived from Microsoft's VS Code documentation: [Developing inside a Container](https://code.visualstudio.com/docs/remote/containers) and also the [advanced](https://code.visualstudio.com/remote/advancedcontainers/overview) section.

The development container included in this repository is derived from [Microsoft's default Ubuntu development container](https://github.com/microsoft/vscode-dev-containers/tree/master/containers/ubuntu).

### Devcontainer Prerequisites

Derived from VS Code's instructions for usage of development containers, documented here: [Developing inside a Container: Getting Started](https://code.visualstudio.com/docs/remote/containers#_getting-started).

1. Docker (Docker Desktop recommended)
2. VS Code

## Usage

1. Ensure you have all [Devcontainer Prerequisites](#devcontainer-prerequisites)
2. Install the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack for VS Code. This will be included if you install recommended workspace extensions upon opening this repository.
3. Ensure Docker is running
4. Make sure you are on the top level of the project. [`/PermaplanT`](https://github.com/ElektraInitiative/PermaplanT).
5. [Open your workspace in the provided devcontainer](https://code.visualstudio.com/docs/remote/containers#_open-an-existing-workspace-in-a-container): Open this repository in VS Code and run **Remote-Containers: Reopen in Container...** from the Command Palette (<kbd>F1</kbd>).

## Philosophy of the directory structure

| File                             | Description                                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [Dockerfile](./Dockerfile)       | The docker file for the dev environment, where you will be connected and your terminal is active.                                 |
| [Dockerfile.pg](./Dockerfile.pg) | The dockerfile for pgadmin.                                                                                                       |
| [.env](./env)                    | The env file for your development environment.                                                                                    |
| [.env.backend](./env.backend)    | The env file for the rust backend process.                                                                                        |
| [.env.fronted](./env.frontend)   | The env file for the fronted process.                                                                                             |
| [pgpass](./pgpass)               | The password used for pgadmin to login.                                                                                           |
| [servers.json](./servers.json)   | For pgadmin to already have a server connection.                                                                                  |
| [setup.sh](./setup.sh)           | A setup script that is executed after the devcontainer is started. Moving the env files to the folders and installing pre-commit. |

Spinning up this devcontainer without changing env variables will give you the following setup:

- A postgis database on http://localhost:5432
  - user: permaplant
  - pass: permaplant
- A pgadmin dashboard on http://localhost:5050
  - username: name@example.com
  - pass: permaplant

It will create two docker volumes:

- pgadmin-data-dev
- postgis-data-dev

and one docker network:

- permaplant-dev

## A note on filesystem performance

Due to limitations in how Docker shares files between the Docker host and a container, it's also recommended that developers [clone PermaplanT source code into a container volume](https://code.visualstudio.com/remote/advancedcontainers/improve-performance#_use-clone-repository-in-container-volume).
This is optional, but highly advised as many filesystem/IO heavy operations (`cargo build`, `npm`, etc) will be very slow if they operate on directories shared with a Docker container from the Docker host.

To do this, open your project with VS Code and run **Remote-Containers: Clone Repository in Container Volume...** from the Command Palette (<kbd>F1</kbd>).

## Opening Pull Requests

Open VS Code and run **Dev Containers: Clone Github Pull Request in Container Volume...**(<kbd>F1</kbd>)
This will create a dedicated volume in docker for this PR and you can even navigate to other PR's, read/write comments etc. .
