# PermaplanT

[PermaplanT](https://www.permaplant.net) is an app for

- Web: Firefox, Chromium
- Larger mobile devices like tablets: Progressive Web App (PWA) Android 9+

## Documentation

Relevant developer documentation for this initiative can be found in the folder `doc`.  
To build and view the documentation in your browser by running the following commands in the projects root folder:

```sh
cargo install mdbook mdbook-mermaid
cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
mdbook serve --open
```

Important links:

- [Web API Documentation](https://www.permaplant.net/doc/api/swagger/ui/)
