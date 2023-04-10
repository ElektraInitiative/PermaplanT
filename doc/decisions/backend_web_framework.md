# Backend Web Framework

## Problem

When looking for a web framework for Rust, one of the main challenges is that there are many different options to choose from, each with its own set of features and capabilities

## Constraints

## Assumptions

## Considered Alternatives

- [Salvo](https://salvo.rs/) ([faster than Actix](https://www.techempower.com/benchmarks/#section=data-r21&hw=ph&test=fortune) but no Diesel integration)
- [Xitca](https://github.com/HFQR/xitca-web) (unstable)
- [Axum](https://github.com/tokio-rs/axum) (quite slow)
- [Rocket](https://rocket.rs/) (quite slow)

## Decision

We will use [Actix Web](https://actix.rs/) as the backend web framework for the Permaplant app.

## Rationale

Actix Web is a web framework for Rust that is known for its high performance, modular design, and extensibility.
Some of the reasons why Actix Web is a good choice for a web project include its focus on scalability and reliability, its support for asynchronous programming, and its rich ecosystem of plugins and extensions:

- [Diesel Integration](https://actix.rs/docs/databases)
- [Unit and Integration Tests](https://actix.rs/docs/testing)

## Implications

## Related Decisions

## Notes
