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
