# Devcontainer

We are also supporting a containerized setup(docker/podman). For more information checkout the README inside [.devcontainer](https://github.com/ElektraInitiative/PermaplanT/blob/master/.devcontainer/README.md).

## Background

(Devcontainer)[https://code.visualstudio.com/docs/devcontainers/containers] allows you to
develop using VSCode, without installing Node and Rust, you only need Docker and the
Dockercontainer extention.

## Install the extention

[Devcontainer](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extention and choose
`Dev Containers: Reopen in Container` in the VSCode command palette. The devcontainer includes a `PgAdmin` container on port `5050`,
see the `.devcontainer` directory.

Within the devcontainer install all dependencies with

```bash
make install
```

## Git user

Globally set git credentials are not available in the devcontainer, set them loaclly.

```bash
git config user.name "Your name"
git config user.email "Your email"
```
