# VS Code Devcontainer for PermaplanT

## Overview

Please note that most of these instructions are derived from Microsoft's VS Code documentation: [Developing inside a Container](https://code.visualstudio.com/docs/remote/containers) and also the [advanced](https://code.visualstudio.com/remote/advancedcontainers/overview) section.

The development container included in this repository is derived from [Microsoft's default Rust development container](https://github.com/devcontainers/images/tree/main/src/rust).

### Devcontainer Prerequisites

Derived from VS Code's instructions for usage of development containers, documented here: [Developing inside a Container: Getting Started](https://code.visualstudio.com/docs/remote/containers#_getting-started).

1. Docker (Docker Desktop recommended) or if you have Podman change a [vscode setting](https://code.visualstudio.com/remote/advancedcontainers/docker-options#_podman).
2. VS Code

## Usage

1. Ensure you have all the above Devcontainer Prerequisites
2. Press the badge on the githup repository or this [link](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/ElektraInitiative/PermaplanT).

## Usage Alternative

1. Ensure you have all the above Devcontainer Prerequisites
2. Install the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack for VS Code. This will be included if you install recommended workspace extensions upon opening this repository.
3. Ensure Docker is running.
4. Inside VS Code press (<kbd>F1</kbd>) and select `Git:Clone` enter the URL `https://github.com/ElektraInitiative/PermaplanT`and clone the project in a folder.
5. If you have the extension pack installed you will get a suggestion on the bottom right of your screen. Press `Reopen in Container`
6. If you dont get a suggestion: Press (<kbd>F1</kbd>) and select `Remote-Containers: Reopen in Container...` from the Command Palette.

## Opening Pull Requests

1. Inside VS Code press (<kbd>F1</kbd>) and select `Dev Containers: Clone Github Pull Request in Container Volume...`
2. Enter the pullrequest URL
   This will create a dedicated volume in docker for this PR and you can even navigate to other PR's, read/write comments etc. .

## Work inside the container without vscode

If you dont have vscode, you can also just enter the container in your terminal.
After having cloned the repository do the following.

```sh
cd .devcontainer
docker compose -p "permaplant_devcontainer" up
docker container ps
```

Find the container id of permaplant_devcontainer-app-1

```sh
docker exec -ti -w /workspaces/PermaplanT 64a2dbee56a5 /bin/sh
```

## Philosophy of the directory structure

| File                             | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| [Dockerfile](./Dockerfile)       | The dockerfile for the dev container           |
| [Dockerfile.pg](./Dockerfile.pg) | The dockerfile for pgadmin.                    |
| [.env](./env)                    | The env file for your development environment. |
| [.env.backend](./env.db)         | Diesel database configurations                 |
| [servers.json](./servers.json)   | Pgadmin server configuration                   |
| [pgpass](./pgpass)               | Pgadmin password for the server configuration. |

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
