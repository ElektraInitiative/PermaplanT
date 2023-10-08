# Frontend API Mocking Tool

## Problem

We need to select an API mocking tool for our frontend development that allows us to simulate API responses for testing and development purposes.

## Constraints

- The selected tool should seamlessly integrate with our frontend development environment.
- It should offer features for simulating different API scenarios, including various response codes, payloads, and latency.

## Assumptions

## Considered Alternatives

- **MSW (Mock Service Worker):** [MSW](https://mswjs.io/)

- **Nock:** [Nock](https://github.com/nock/nock)

- **MirageJS:** [MirageJS](https://miragejs.com/)

- **WireMock:** [WireMock](http://wiremock.org/)

## Decision

We have decided to use [MSW (Mock Service Worker)](https://mswjs.io/) as our API mocking tool for frontend development.

## Rationale

MSW offers several advantages that align with our requirements and constraints:

- **Request Interception and Mocking:** MSW provides a powerful request interception and mocking system, allowing us to simulate various API scenarios, including different response codes, payloads, and latency. This flexibility is crucial for testing and development.
- **Active Community and Documentation:** MSW has a thriving community and comprehensive documentation, which will aid our team in quickly learning and effectively using the tool. This support ensures that we can troubleshoot any issues that may arise during development.

## Implications

- Our development team will need to become familiar with MSW's usage and configuration to effectively use it for API mocking.
- Integration of MSW into our existing development tools and pipelines will be necessary.

## Related Decisions

## Notes
