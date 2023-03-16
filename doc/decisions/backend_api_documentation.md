# Backend API documentation

## Problem

We need a way to document the API in the backend.  
Otherwise we would have to read the Rust Code every time we want to develop a new part of the frontend.

## Constraints

- it must be easy enough to use as most people know only a little bit of Rust
- it should take less time compared to manually maintaining API documentation

## Assumptions

- the backend's API is only used by the frontend

## Solutions

### Utoipa

You can think of [Utoipa](https://github.com/juhaku/utoipa) as the Rust equivalent to Swagger/OpenApi in Java.

It is a Rust crate which allows you to annotate your code (structs and endpoints) and automatically generate OpenApi documentation from that.  
You can also generate a UI endpoint just like with Java Spring.

Compared to Swagger in Java there is a bit more you have to configure to get it running.

Once you get it running you get endpoints with schemas and examples representing the API.  
You can also execute example requests directly from the UI to see how the backend behaves.

### API Blueprint

Information from <https://testfully.io/blog/api-blueprint/>.

Before starting on a new endpoint we would write a markdown document specifying in detail what the endpoint should return and in what format.  
There is also a [lot of tooling](https://apiblueprint.org/tools.html) for API Blueprint.

## Decision

We will use Utoipa to automatically generate API documentation from code.  
Additionally we will provide an endpoint which will display the API documentation using Swagger.

## Rationale

With Utoipa it is possible to generate API documentation directly from code whereas with API Blueprint we would have to write the API documentation by hand in markdown files (at least I have yet to find a crate that automatically generates required markdown files).  
Additionally if we where to use API Blueprint every time the API changes we would have to remember to change the markdown files as well, which is easily forgotten and might become tedious when making smaller changes.

For me (@kitzbergerg) it is easier to use Utoipa as it generates Swagger/OpenApi which I have already used.  
I would have to learn API Blueprint and its tooling from scratch.  
With that I would argue that more people know Swagger/OpenApi leading to easier onboarding.

One advantage of API Blueprint would be that we have to carefully think about the API (API-First Approach) before actually implementing.  
This leads to a clean API in the long run, however it is more difficult to quickly prototype and try different approaches (which in my opinion is currently more important as we are somewhat at the beginning of the project).

## Implications

-   When deciding on a new endpoint it will take longer for the API documentation to be done, as the backend code has to be finished first.
-   The API documentation will not deviate from the actual implementation as it is generated from code.
-   Developers have to know Swagger, but once they do they can easily check the API in the browser served by the backend.
-   Backend Developers have to invest some time into reading Utoipa's documentation.

## Related Decisions

## Notes
