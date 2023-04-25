# Test Setup

## Testing Approach

The testing approach for PermaplanT will follow a mix of unit testing, integration testing, and manual testing.
Unit testing will be conducted for individual components and functions to ensure that they are working as expected.
Integration testing will be conducted for API endpoints and interactions between components to ensure that they are functioning correctly together.
Manual testing will be conducted for end-to-end functionality and overall user experience.

## Unit Testing

Unit tests are used to test individual units of code in isolation from the rest of the system. This is important because it allows us to validate that each unit is working as intended, without interference from other parts of the system.

### Frontend

For the frontend unit tests will be used to test the following areas:

- State management logic: Since the frontend relies heavily on state management, it is important to ensure that the state is being properly managed and updated.
- Functions that handle data manipulation, such as sorting or filtering
- Components that render UI elements
- Async actions, such as API calls or event handling
- Form validation and submission

### Backend

For the backend, unit tests will be used to test the following areas:

- Database queries and operations
- Business logic and data manipulation, e.g. code that performs calculations, manipulates data, or makes decisions based on input
- Authentication and authorization
- Error handling

In the backend unit tests can be found in the `src/` directory.
They are to be put in the same file as the functions or modules they are supposed to test.
Create separate modules called test in that file annotated with `#[cfg(test)]` (that way they are only compiled when actually running tests).  
See the [rust doc](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html) for reference.

Short example:

```rust
struct Plants;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_plants() {
      // Test complicated plants function here
      todo!()
    }
}
```

## Integration Testing

Integration tests are used to test the integration between different parts of the system. This is important because it allows us to validate that the different parts of the system are working together correctly.

In the application the integration tests will be used to test the following areas:

### Frontend

- API calls using a mock API

### Backend

- API endpoints
- Database queries

In the backend integration tests can be found in the `src/test/` directory.
The whole module is annotated with `#[cfg(test)]` and will therefore only be compiled for tests.

## Manual Testing

Manual testing will include performing an end-to-end testing of the application to ensure overall functionality and user experience.
This will include testing of all features, navigation, and error handling.
Manual tests will be documented under `doc/tests`.

## Other Considerations

- Tests should be run automatically on every push to the repository
- Tests should be run before committing via pre-commit hooks
- Tests should be run on multiple browsers
- Tests should be run on different configurations (e.g. production, staging)
