# PermaplanT

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/ElektraInitiative/PermaplanT)

[PermaplanT](https://www.permaplant.net) is an app for

- Web: Firefox, Chromium
- Larger mobile devices like tablets: Progressive Web App (PWA) Android 9+

Start reading in [/doc/architecture/README.md](/doc/architecture/README.md).
The documentation is best viewed by running the following commands in the projects root folder:

```sh
cargo install mdbook mdbook-mermaid
cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
mdbook serve --open
```

Which will open [/doc/architecture/README.md](/doc/architecture/README.md) as first page.

Important links:

- [Web API Documentation](https://www.permaplant.net/doc/api/swagger/ui/)
