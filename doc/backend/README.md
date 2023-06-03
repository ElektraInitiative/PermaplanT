# PermaplanT Backend

## Requirements

- Rust 1.67.1 or later ([Installation guide](../development_setup.md))
- [PostgreSQL](https://www.postgresql.org/download/) version 13 or later
- libpq-dev
- libssl-dev
- pkg-config

## Additional Documentation

To view an interactive API documentation go to <https://www.permaplant.net/doc/api/swagger/ui/>.  
If you have the backend running locally you can also visit <http://localhost:8080/doc/api/swagger/ui/>.

Alternatively there is a [OpenAPI specification](https://spec.openapis.org/oas/latest.html) in json format at <https://www.permaplant.net/doc/api/openapi.json>.

To view code documentation run the following in the `backend/` folder:

```shell
cargo doc --open
```
