# Development Setup

## Prerequisites

If you want to develop on the backend, make sure you have enough RAM.
When performing cargo build, we have experienced (on wsl) a usage of ~12GB.

- Python
- Rust
- Javascript
  - nvm
  - node

## Operating Systems

- Windows 11
- macOS 13.1 (Unix)

## IDE

- [Visual Studio Code](https://code.visualstudio.com/) for both Frontend and Backend

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

## Package Managers

- Frontend [npm](https://www.npmjs.com/)
- Backend [cargo](https://crates.io/)

### Installing Node + Npm

If you are using unix, macOS, and windows WSL, consider using [nvm](https://github.com/nvm-sh/nvm)
to manage your node environment:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 19.4.0
nvm use 19.4.0
```

Or if you use the default macOS starting with Catalina shell `zsh`, try:

```zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh)"
```

### Installing Rust + Cargo

If you’re using Linux or macOS, open a terminal and enter the following command:

```bash
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

This installs rust and cargo automatically on your machine.
If you get linker errors, proceed by installing a C Compiler, which will typically include a linker.

To install our specific version of Rust, just run the following command:

```bash
rustup install 1.74
```

On Windows, go to https://www.rust-lang.org/tools/install and follow the instructions for installing Rust.
At some point in the installation, you’ll receive a message explaining that you’ll also need the MSVC build tools for Visual Studio 2013 or later.

To acquire the build tools, you’ll need to install Visual Studio 2022. When asked which workloads to install, include:

- Desktop Development with C++
- The Windows 10 or 11 SDK
- The English language pack component, along with any other language pack of your choosing

In case you don't prefer any of the previously mentioned installations methods, click
[here](https://forge.rust-lang.org/infra/other-installation-methods.html) for alternatives.

## Browsers

- Chrome 108.0.5359
- Firefox 108.0.2

## Dependencies

If you want to install all necessary dependencies for development:

```
in /workspaces/PermaplanT $ make install
```

## Containers

We are also supporting a containerized setup(docker/podman). For more information checkout the README inside [.devcontainer](https://github.com/ElektraInitiative/PermaplanT/blob/master/.devcontainer/README.md).

## Github Codespaces

PermaplanT supports Github codespaces. If you are interested in developing inside Github Codespaces you can learn more about [here](https://docs.github.com/de/codespaces).
