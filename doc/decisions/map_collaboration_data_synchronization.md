# Map Collaboration & Data Synchronization (Offline)

## Problem

The user wants to view changes that other users have made on the map, therefore the data needs to be kept in sync.
The user should also be able to access some features of the application while being offline and later synchronize her changes to the server.

## Constraints

- The solution should be simple.
- If any conflicts arise that can not automatically be resolved, the user should have choice over how to resolve such changes (keep local/keep remote).
- The solution should only disturb the user experience when necessary.
- After the conflict is resolved all users should have a consistent state.
- Users can not concurrently add changes to the same layer (removes complexity).

## Assumptions

- A 100% multiplayer solution is not required, therefore the data can possibly be stale for a short while for some of the users.
- Collaboration is more important than the feature being available in an offline environment.

## Solutions

### Layer Locking, Version Synchronization.

#### Layer Locking:

If a user wants to change a layer, the layer is locked for the editing user.
Users without the lock have read-only access to the layer.
The lock is kept for a certain amount of time but can be refreshed.
For refreshing a timestamp is kept when the lock got attained/refreshed.
Users can give up on the lock.

#### Data Synchronisation via Timestamps:

Each action is associated with a timestamp (for ease of implementation this timestamp is the local time in UTC).
Each object on the map has an associated timestamp as well.

#### Version Synchronisation for Read-only Users:

The data visible to read-only users, is the latest version of the map.
This data is kept in sync via a polling mechanism.

If the user keeping the lock saves the changes, all built-up changes are bundled into a new version and saved to the database.
Undo/redo ability is lost at this point in time.
On layer/alternative switch the changes are bundled into a new version as well and saved to the database, then the lock is freed.

#### Offline

For a user to be able to make changes offline, she has to have attained the lock prior.
If the lock gets lost while the user is offline and has made changes, timestamp-based resolution (TBR) to resolve the conflicts.
If the lock is not lost, upon coming back online, the lock is refreshed.
TBR is implemented on the backend.
If a new user is keeping the lock and the TBR resolved changes, those changes are propagated back to the lock-keeping user.
If the user made changes to objects affected by the TBR, a merge resolution UI is displayed (keep yours/keep remote).

### Alternative B (not found)

### Alternative C (not found)

## Decision

## Rationale

This is the simples solution that I came up with.
