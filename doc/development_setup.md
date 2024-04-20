# Development Setup

## Prerequisites

If you want to develop on the backend, make sure you have enough RAM.
When performing cargo build, we have experienced a usage of ~12GB.

## Operating Systems

- Ubuntu or another Ubuntu/Debian-based Linux system
- Ubuntu in [WSL](https://learn.microsoft.com/de-de/windows/wsl/install) on Windows

## Ways to develop PermaplanT

Right now we have three different ways to develop PermaplanT:

### Docker services + local development

Run the database and other services in Docker containers but run backend and frontend locally.
[Read more](development/01docker+local.md)

### Dev container

Run everything within the VSCode devcontainer.
[Read more](development/02devcontainer.md)

### Local setup

Run everything locally, including the database setup.
[Read more](development/03local.md)

## IDE

- [Visual Studio Code](https://code.visualstudio.com/) for both Frontend and Backend
- [IntelliJ IDEA](https://www.jetbrains.com/idea/?var=1) for both Frontend and Backend

## Visual Studio Code Extensions

Frontend

- [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint) for JavaScript/TypeScript linting and code formatting

Backend

- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

Rust formatting can be achieved by adding the following to settings.json in VSCode after installing rust-analyzer:

```json
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer",
    "editor.formatOnSave": true
  }
```

## Browsers

- Chrome 108.0.5359
- Firefox 108.0.2

## Dependencies

If you want to install all necessary dependencies for development run following command in `/workspaces/PermaplanT`:

```bash
make install
```

## Github Codespaces

PermaplanT supports Github codespaces. If you are interested in developing inside Github Codespaces you can learn more about [here](https://docs.github.com/de/codespaces).

## Backend Setup

[Setup for Backend](backend/01setup.md)

## Frontend Setup

[Readme in Frontend](../frontend/README.md)
