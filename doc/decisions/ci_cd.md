# CI/CD

## Problem

We need to implement a continuous integration and delivery (CI/CD) process to automate the build, testing, and deployment of the app.

## Constraints

- The CI/CD process must be compatible with our version control system (Git).
- The process must be able to run automated tests as part of the build process.

## Assumptions

- The app is well-structured and easy to test.

## Considered Alternatives

GitHub Actions: [GitHub Actions](https://github.com/features/actions) is a cloud-based service that is built into GitHub and is specifically designed for CI/CD with GitHub repositories.
It is easy to use and requires little technical knowledge to set up.
However, it may not be as flexible as some other alternatives, and it may not be suitable for projects that require more advanced CI/CD capabilities.

## Decision

We will use [Jenkins](https://www.jenkins.io/) for our CI/CD process.

## Rationale

While GitHub Actions is a convenient and easy-to-use option, it may not be as flexible as Jenkins, which has a wider range of features and plugins.
In addition, Jenkins is an open-source tool that is widely used and has a large community of users and developers, which means that it is likely to be well-documented and supported.
Finally, Jenkins is compatible with a wide range of tools and services, which may be important for the app as it grows and evolves.

## Implications

## Related Decisions

## Notes
