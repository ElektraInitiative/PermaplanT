# Uuid

## Problem

Due to their randomness UUIDs might be sub-optimal for database operations,
see https://www.cybertec-postgresql.com/en/unexpected-downsides-of-uuid-keys-in-postgresql/

## Constraints

## Assumptions

1. we are actually hit by the problem
2. we cannot easily change the UUIDs later in production

## Solutions

### Use UUIDv7

https://www.ietf.org/archive/id/draft-peabody-dispatch-new-uuid-format-04.html

### Use ULIDs

https://github.com/ulid/spec

## Decision

Not yet decided

## Rationale

## Implications

## Related Decisions

## Notes
