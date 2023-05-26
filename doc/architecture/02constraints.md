# Constraints

- Code should be as simple as possible.
- UI should be hard to use it wrong.
- User experience should only be disturbed when necessary.
- Collaboration is more important than the feature being available in an offline environment.

## Data Consistency

- Users cannot concurrently add changes to the same layer (removes complexity).
- After conflicts are resolved all users should have a consistent state.
- If any conflicts arise that cannot automatically be resolved, the user should have choice over how to resolve such changes (keep local/keep remote).

## Backend

- API calls should be for interactive use and as such terminate within parts of a second, five seconds maximum.

### Graceful Shutdown

Actix by default handles shutdowns (see [here](https://actix.rs/docs/server/#graceful-shutdown) for reference).  
As soon as the signal `SIGTERM` is issued to the backend no new connections will be accepted.

- Still running connection will be finished or terminated after 5sec.
- API requests should ideally take no longer than a few seconds, with a 5-second limit for logging and optimization purposes.
- Implementing this limit improves convenience for both developers (termination of endless loops) and continuous integration (faster restart on hanging API calls), with minimal complexity in the code.
