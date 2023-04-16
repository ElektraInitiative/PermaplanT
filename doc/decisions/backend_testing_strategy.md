# Backend Testing Strategy

## Problem

Our current setup regarding test in the backend isn't completly thought through.  
There is no differentiation between unit and integration tests.  
Setting up new tests seems more complicated than necessary.  
It isn't clear how the test database/connection is actually setup up or how it works with `begin_test_transaction()`.

## Constraints

1. diesel and typeshare still have to work (even if we separate into binary and library part)

## Assumptions

## Solutions

### Run all tests as unit tests

This is the current solution.

All tests are put into the `src/` directory and run from there.  
There is no real separation between unit and integration tests as all tests are treated the same.

### Split into unit and integration tests

This would involve splitting the backend into a binary and library part (see the [rust book](https://doc.rust-lang.org/book/ch11-03-test-organization.html#integration-tests-for-binary-crates) for reference.  
The code change required for this would be rather small, mainly consisting of renaming the current `main.rs` into `lib.rs` and creating a new `main.rs` that calls into the library.

After this is done there would be a clear differentiation between unit and integration tests.

- Unit tests are in `src/`.  
  They are modules annotated with `#[cfg(test)]` and are supposed to test individual functions or smaller parts of the code (see [here](https://doc.rust-lang.org/book/ch11-03-test-organization.html#unit-tests)).  
  We might not even need to create unit tests as of now as there are no complicated functions.
- Integration tests are in `tests/`.  
  They are separate from the other code and only have access to public facing API (in this case meaning public functions/structs/... that can be accessed from outside the library part; see [here](https://doc.rust-lang.org/book/ch11-03-test-organization.html#integration-tests)).  
  Using this we would start the server similarly to how `main.rs` starts the server and then make requests and validate responses.

A major advantage of this approach is that the server is actually started in a very similar way to how it would be started via `cargo run`.

On the other hand it might be more difficult to set up tests as you first have to start the server (in its own thread), wait until it is up and then send requests to it (probably with something like [reqwest](https://docs.rs/reqwest/latest/reqwest/)).

## Decision

We should keep the test as unit tests. We should still do a bit of refactoring for the tests we currently have, although there won't be major changes.

## Rationale

Our project is not a library therefore splitting it into binary and library part doesn't really make much sense.

Actix itself writes tests as unit tests (although they are in part called integration tests in their documentation).
It just seems easier to define specific services and handlers that you want to test.

Most resources I found use integration tests exclusively for libraries.
Application servers are tested without starting the whole server, but rather by calling individual endpoints (like in Actix' documentation).

## Implications

## Related Decisions

## Notes
