# REST

We exclusively use:

- JSON or images as content.
- GET to retrieve resources.
- POST to submit new resources to the server.
- PUT to fully update an existing resource (fails if it does not exist).
- PATCH to update parts of an existing resource (fails if it does not exist).
- DELETE to remove resources.

Both PUT and PATCH should be implemented idempotent.
I.e., doing the same API calls again must be a NOP.

## Endpoints

The endpoint paths use:

- hierarchical structure
- nouns instead of verbs
- only plural (exception: config)
- all endpoints need authorization (exception: config)
- all paths below `/api`
- layer-specific paths below `/layers/<name of layer>/` e.g. `/layers/plants/plantings`

## Parameters

- Search should have its own endpoint (no parameter needed)
- We use the parameter `page` and `per_page` (type integer) for pagination.
- Currently we don't use filtering or sorting.
- If in doubt, leave it out: keep parameters minimal.

## Versioning

The frontend is the only user, so we only need minimal API versioning.
The frontend only need to know if a reload is needed.

## Files

We use utility functions to access files in Nextcloud.

## Documentation

Documentation of APIs is done via `utopia`:

- [utoipa::path](https://docs.rs/utoipa/latest/utoipa/attr.path.html#actix_extras-support-for-actix-web) must be present for every endpoint e.g. `#[get(...)]`
- all possible responses should be documented
  - specific [2xx codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses), e.g., we use `201 Created` for successful `POST` requests
  - all ways client could behave wrongly[^note] using [4xx error codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses)

[^note] i.e., how the API could be wrongly used (preconditions not met etc.)

Example:

```rust,ignore
#[utoipa::path(
    context_path = "/api/maps",
    responses(
        (status = 200, description = "Fetch a map by id", body = MapDto)
    ),
)]
```

## Security

All endpoints except of `/api/config` must use Keycloak's jsonwebtoken and indicate so using:

```rust,ignore
#[utoipa::path(
    security(
        ("oauth2" = [])
    )
)]
```

## Further Readings

- [RFC](https://datatracker.ietf.org/doc/html/rfc7231)
- [Swagger Best Practices](https://swagger.io/resources/articles/best-practices-in-api-design/)
- [Microsoft Best Practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [OpenAPI](https://spec.openapis.org/oas/latest.html)
