# REST

We exclusively use:

- JSON or images as content.
- idempotent resources.
  (doing the same API calls again is a NOP)
- GET to retrieve resources.
- POST to submit new resources to the server.
- PUT to update an existing resource (fails if it does not exist).
- DELETE to remove resources.

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
