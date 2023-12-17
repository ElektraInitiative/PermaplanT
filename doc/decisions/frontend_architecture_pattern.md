# Frontend Architecture Pattern

## Problem

PermaplanT needs to be designed with a documented, consistent and maintainable architecture pattern.

## Constraints

The architecture pattern should be

- easy to understand and follow
- be easy to test
- be easy to scale
- be suitable for a large, highly-interactive application
- promote code reuse
- be well-documented and widely used in the React community

## Considered Alternatives

- [Flux](https://reactjs.org/blog/2014/05/06/flux.html)

  The pattern is rather complicated to understand and leads to a lot of boilerplate.

- [MVVM](https://www.detroitlabs.com/blog/intro-to-mvvm-in-react-with-mobx/)

## Decision

[Bulletproof React](https://github.com/alan2207/bulletproof-react) will be used as frontend architecture and guideline for PermaplanT.
Choices or derivations of this guidelines will be documented in [our architecture](../architecture).

## Rationale

Bulletproof React is a set of best practices and conventions that promote code reuse and make it easy to reason about the structure of the application.
It's simple, easy to understand, and easy to test.
This makes it a good choice for a large, complex application like PermaplanT.
Additionally, it is well-documented and widely used in the React community, which means that there is a lot of resources and support available for it.

## Implications

## Related Decisions

## Notes

- "bulletproof react" architecture pattern is developed by the team at Level Up Tutorials.
  It is not an official pattern by React.
