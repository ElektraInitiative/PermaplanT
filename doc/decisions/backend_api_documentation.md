# Backend API documentation

## Problem

We need a way to document the API in the backend. Otherwise we would have to read the Rust Code every time we want to develop a new part of the frontend.

## Constraints

## Assumptions

## Solutions

### Utoipa

You can think of [Utoipa](https://github.com/juhaku/utoipa) as the Rust equivalent to Swagger/OpenApi in Java.

It is a Rust crate which allows you to annotate your code (structs and endpoints) and automatically generate OpenApi documentation from that. You can also generate a swagger-ui endpoint to just like with Java Spring.

Compared to swagger in Java there is a bit more you have to configure to get it running, but once that is done you get endpoints with schemas and examples. You can also execute example requests directly from the swagger-ui to see how the backend behaves.

### API Blueprint

Information from <https://testfully.io/blog/api-blueprint/>.

Before starting on a new endpoint we could write a document specifying in detail what the endpoint should return and in what format. This would allow both the frontend and backend to work somewhat simultaneously on new features.

## Decision

Utoipa

## Rationale

With Utoipa it is possible to generate API documentation directly from code whereas with API Blueprint we would have to write the API documentation by hand in markdown files (at least I have yet to find something similar to Utoipa in Rust).

Additionally for me (@kitzbergerg) it is easier to use Swagger/OpenApi as I have already used it. I would have to learn API Blueprint and its tooling from scratch.

One advantage of API Blueprint would be that we have to carefully think about the API first (API-First Approach) before actually implementing. This leads to a clean API in the long run, however it is more difficult to quickly prototype and try different approaches (which in my opinion is currently more important as we are somewhat at the beginning of the project).

## Implications

- When deciding on a new endpoint it will take longer for the API documentation to be done, as the backend code has to be finished first.
- The API documentation will not deviate from the actual implementation as it is generated from code.
- Developers have to know Swagger, but once they do they can easily check the API in the browser served by the backend.

## Related Decisions

## Notes

Once the project is in a later stage we might consider additionally using API Blueprint. At that point a cleaner API becomes more important and making changes requires more careful consideration.