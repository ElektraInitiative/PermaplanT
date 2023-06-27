# Software Testing Strategy

## Introduction

The software testing strategy aims to ensure the delivery of high-quality software by employing a comprehensive testing approach throughout the development lifecycle. This strategy combines various testing types and levels to validate the functionality, performance, and security of the software.

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

- End-to-End testing of critical workflows
- Integration testing of various modules and components
- System tests
- Performance tests
- Security tests
- Regression testing
- User acceptance testing
- Compatibility testing on different platforms, browsers, and devices?

## Testing Types and Levels

### 1. Unit Testing

- Unit tests must be created by every developer during the development process, following the Arrange-Act-Assert (AAA) pattern.

### 2. Integration Testing

- Continuous Integration (CI) pipelines must run integration tests for different modules and components.

### 3. System Testing

- System tests must be protocolled and errors must be categorized by level and priority.
- Test scenarios must be derived from functional requirements and use cases.
- Testers must perform End-to-End testing of the software, including all user workflows and system integrations.
- Exploratory testing techniques must be utilized to uncover potential issues and edge cases.

### 4. Performance Testing

- ?

### 5. Security Testing

- ?

## Test Environment and Infrastructure

- Test environments must mirror production environments as closely as possible.
  - Windows 10/11 or Linux with Python 11 and node v19 etc ...
- Virtualization and containerization technologies, such as Docker and Kubernetes, must be utilized for test environment management.
- Test environments must be version controlled and easily reproducible.

## Testing Tools

- Rust built-in tests by cargo
- Selenium/Cucumber
- Jest

## Test Data Management

- Test data must be synthetic. Only in rare cases, and if the expected outcome can be calculated, random data is allowed.
- Test data must cover a variety of scenarios, including at least valid and invalid cases.
- Equivalence partitioning and boundary value analysis tests should be done when it makes sense.

## Test Execution and Reporting

- Test cases must be executed manually or via automation scripts, as appropriate for each testing type.
- Unit tests must be executed before commiting to the VCS to speed up the detection of bugs and simple code breaks.
- Integration tests must be executed by the CI pipeline after committing to the VCS or when opening a new PR.
- Test metrics, such as test coverage and test execution time, must be tracked locally or in the automated pipeline.
- System and User acceptance tests must be performed before every release.

## Test Automation

- Unit and Integration tests must be fully automated.
- Security and Performance tests may be manual.
- Some End-to-End tests must be automated by utilizing Capture/Replay techniques.
- Selenium, Cypress and Jest must be used for UI automation testing.
- API testing must be automated using tools like Postman?
