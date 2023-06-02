# REST

We exclusively use:

- JSON or images as content.
- GET to retrieve resources.
- POST to submit new resources to the server.
- PUT to fully update an existing resource (fails if it does not exist).
- PATCH to update parts of an existing resource (fails if it does not exist).
- DELETE to remove resources.

Both PUT and PATCH should be implemented idempotent.
Doing the same API calls again must be a NOP.

## Endpoints

The endpoint paths use:

- hierarchical structure
- paths below /api
- nouns instead of verbs
- only plural (exception: config)
- all endpoints expect config need authorization

## Parameters

- We use the parameter `page` (type integer) for pagination.
- Search should have its own endpoint (no parameter needed)
- Currently we don't use filtering or sorting.

## Versioning

The frontend is the only user, so we only need minimal API versioning.
The frontend only need to know if a reload is needed.
