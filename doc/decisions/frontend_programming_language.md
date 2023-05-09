# Frontend Programming Language

## Problem

The PermaplanT app needs a frontend programming language to build its user interface and provide interactivity for its users.

## Constraints

- The programming language must be widely supported and have a large developer community.
- The frontend language must be compatible with modern web browsers, including Firefox and Chromium.
- The language must be easy to learn and use, to allow for a range of skill levels among developers.
- The language must have good support for modern web technologies like HTML5 and CSS3.
- The language must be suitable for use in a PWA environment.
- We want to use a typed language to improve maintainability and catch errors earlier in the development process.

## Assumptions

- The use of TypeScript as a frontend programming language will enable the app to be developed quickly and efficiently.
- TypeScript has a large and active developer community, which will provide support and resources for the development of the app.
- The use of TypeScript will enable the creation of visually appealing and interactive user interfaces.
- TypeScript will provide sufficient type checking to improve the maintainability of our codebase.
- TypeScript will not significantly impact the performance of our application.

## Considered Alternatives

- JavaScript:
  [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript?retiredLocale=de) is the default language for React, and the most commonly used language for frontend development.
  However, JavaScript is a dynamically typed language, which can make it error-prone and less maintainable in the long term.
- Rust:
  [Rust](https://www.rust-lang.org/) is primarily used for creating backend systems, applications, and libraries.
  It is not typically used for frontend development, as it does not have built-in support for graphical user interface development.
  Libraries like [yew](https://yew.rs) are simply not stable enough yet.
  See also [this lengthy comparison of web UI libraries](https://monadical.com/posts/shades-of-rust-gui-library-list.html).

## Decision

We will use [TypeScript](https://www.typescriptlang.org/) 4.9.3 as the frontend programming language for app.

## Rationale & Implications

TypeScript is a statically-typed language that is a superset of JavaScript, meaning that it includes all the features of JavaScript in addition to additional type-related features.
This can help improve the overall quality and maintainability of the codebase by catching potential errors at compile-time rather than runtime, as well as enabling better editor support and code navigation.
Additionally, TypeScript's type system allows for the creation of more scalable and reusable code, as well as easier refactoring and code review processes.
In comparison to other frontend languages, TypeScript offers a strong balance between the benefits of static typing and the flexibility and familiarity of JavaScript, making it a suitable choice for the PermaplanT app.

The app will be able to take advantage of the large ecosystem of libraries and resources available for TypeScript development.

## Related Decisions

- The decision to support multiple platforms and browsers.
- The decision to prioritize a smooth and interactive user experience.
- Decision: Frontend UI Framework

## Notes
