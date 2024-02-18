# Testing Strategy

## Testing Approach

The software testing strategy aims to ensure the delivery of high-quality software by employing a comprehensive testing approach throughout the development lifecycle.
This strategy combines various testing types and levels to validate the functionality, performance, and security of the software.

The testing approach for PermaplanT will follow a mix of unit testing, integration testing, and system testing.
Unit testing will be conducted for individual components and functions to ensure that they are working as expected.
Integration testing will be conducted for API endpoints and interactions between components to ensure that they are functioning correctly together.
System tests will be conducted as manual tests and automated e2e tests.

## Objectives

- Ensure that the software meets functional requirements and operates as intended.
- Identify and mitigate risks associated with software defects and failures.
- Enhance user experience by maintaining low bugrate and responsiveness.
- Improve overall software quality and reliability.
- Maintain an 80% backend branch coverage.

## Out of Scope:

- Database tests
- Stress tests

## In Scope:

- End-to-End testing of important [use cases](../usecases)
- Integration testing of various modules and components
- System tests
- Performance tests
- Security tests
- Regression testing
- User acceptance testing
- Compatibility testing on different platforms, browsers, and devices

## Testing Types and Levels

### 1. Unit Testing

Unit tests are used to test individual units of code in isolation from the rest of the system.
This is important because it allows us to validate that each unit is working as intended, without interference from other parts of the system.

- Unit tests must be created by every developer during the development process, following the Arrange-Act-Assert (AAA) pattern.

Short example:

```rust
struct Plants;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_abs_for_a_negative_number() {
    // Arrange
    let negative = -5;

    // Act
    let answer = abs(negative);

    // Assert
    assert_eq!(answer, 5);
    }
}
```

#### Frontend

For the frontend unit tests will be used to test the following areas:

- State management logic: Since the frontend relies heavily on state management, it is important to ensure that the state is being properly managed and updated.
- Functions that handle data manipulation, such as sorting or filtering
- Components that render UI elements
- Correct event handling
- Form validation and submission

#### Backend

For the backend, unit tests will be used to test the following areas:

- Database queries and operations
- Business logic and data manipulation, e.g. code that performs calculations, manipulates data, or makes decisions based on input
- Authentication and authorization
- Error handling

In the backend unit tests can be found in the `src/test` directory.

### 2. Integration Testing

Integration tests are used to test the integration between different parts of the system.
This is important because it allows us to validate that the different parts of the system are working together correctly.

In the application the integration tests will be used to test the following areas:

- Continuous Integration (CI) pipelines must run integration tests for different modules and components.

#### Frontend

- API calls using a mock API

#### Backend

- API endpoints
- Database queries

In the backend integration tests can be found in the `src/test/` directory.
The whole module is annotated with `#[cfg(test)]` and will therefore only be compiled for tests.

### 3. System Testing

System testing will include end-to-end testing of the application to ensure overall functionality and user experience.
This will include testing of all features, navigation, and error handling.

- System test scenarios must be derived from the use cases and the requirements they imply.
- Manual system tests are documented in [`doc/tests/manual/protocol.md`](./manual/protocol.md).
- Automated system tests (e2e tests) can be found in the top-level `e2e` folder.
- Both are specified in Gherkin syntax.
- Exploratory testing techniques must be utilized to uncover potential issues and edge cases.

### 4. Performance Testing

- TBD by @badnames

### 5. Security Testing

- TBD by @temmey

## Test Environment and Infrastructure

- Test environments must mirror production environments as closely as possible.
- Virtualization and containerization technologies, such as Docker must be utilized for test environment management.
- Test environments must be version controlled and easily reproducible.

## Testing Tools

- E2E: Python Playwright & Pytest + plugins
- Backend: Rust built-in tests by cargo
- Frontend: Vitest

## Test Data Management

- Test data must be synthetic.
- Test data must cover a variety of scenarios, including at least valid and invalid cases.
- Equivalence partitioning and boundary value analysis tests should be done when it makes sense.

## Test Execution and Reporting

- Test cases must be executed manually or automated, as appropriate for each testing type.
- All automated tests must be executed by CI.
- Integration tests must be executed by the CI pipeline on every push to PR and every merge to master.
- Test metrics, such as test coverage and test execution time, must be tracked in the pipeline.
- System tests and User acceptance tests must be performed before every release.
- Manual tests will be documented under [`doc/tests/manual/reports`](./manual/reports/README.md)
- An Email is send whenever master fails, with a small report containing information since last build.

## Test Automation

- Unit and Integration tests must be fully automated.
- Security and Performance tests may be manual.
- System tests are automated (if possible) according to [the e2e guidelines](../guidelines/e2e.md).

## Other Considerations

- Tests should be run before committing via pre-commit hooks
- Tests should be run on different configurations (e.g. production, staging)
