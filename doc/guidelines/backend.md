# Backend

Nearly all guidelines are documented using rust-clippy, so this document is kept short.

- Always derive `Debug` and `Clone` (but beware of deriving Copy).
- Actions must be created in `backend/src/model/dto/actions.rs`.
- We reuse the global http client like this: `let server = HttpServer::new(move || { App::new() /*other initialization code*/ .app_data(http_client.clone()) })`.
- Read also about [backend logging](backend-logging.md).
