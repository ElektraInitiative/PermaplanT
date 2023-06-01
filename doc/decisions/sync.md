# Sync

## Problem

For better collaboration, the frontend must be kept up to date with the latest changes in the frontend.

## Constraints

1. The changes must be sent immediate.
2. Events must be sent to thousands of clients.
3. It should be extensible to also include events of other use cases (changes in plant database or avoiding poll for Nextcloud chat)

## Assumptions

1. We don't need to acknowledge sent events.
2. We don't need to know which events we missed (as frontend is read-only or database is locked when offline)

## Solutions

### Websockets

Websockets with a protocol like [STOMP](https://stomp.github.io/stomp-specification-1.2.html) could be used.

## Decision

We use [server-sent events (SSE)](https://docs.rs/actix-web-lab/latest/actix_web_lab/sse/) with the observer pattern in the backend.

## Rationale

- [Example](https://github.com/arve0/actix-sse/) is available and already tested with a thousand of clients.
- This adds additional complexity on client and server side as we don't need a full-duplex communication.

## Implications

N/A

## Related Decisions

- [Map undo/redo implementation](map_undo_redo_implementation.md)
- [Frontend state management](frontend_state_management.md)

## Notes

@Bushuo creates a tracer bullet to check how it works.
