# Constraints

- [Guidelines](../guidelines) must be either followed or a rationale for breaking the guideline must be given in a comment nearby

## UI

- UI should be hard to use wrong.
- User experience should only be disturbed when necessary.
- UI must be consistent:
  - Colors
  - Use toolbars
  - Reuse components (in storybook)
  - Keybindings
  - personified error messages
  - etc.

Rationale: to support main goal

## Data Consistency

- Users always see the latest data.
- The data from the backend is the single source of truth.
  I.e., in conflicting scenarios always the backend takes preference.
- In offline scenarios either the backend gets locked or the frontend gets read-only.

Rationale: we prefer collaboration over offline use.

## Backend

- We use REST with JSON
- API calls should be for interactive use and as such terminate within parts of a second, five seconds maximum, see Graceful Shutdown for more information.

### Graceful Shutdown

Actix by default handles shutdowns (see [here](https://actix.rs/docs/server/#graceful-shutdown) for reference).  
As soon as the signal `SIGTERM` is issued to the backend no new connections will be accepted.

- Still running connection will be finished or terminated after 5sec.
- API requests should ideally take no longer than a few seconds, with a 5-second limit for logging and optimization purposes.
- Implementing this limit improves convenience for both developers (termination of endless loops) and continuous integration (faster restart on hanging API calls), with minimal complexity in the code.
