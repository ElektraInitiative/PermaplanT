# Frontend Programming Language

## Problem

The Permaplant app needs a frontend programming language to build its user interface and provide interactivity for its users.

## Constraints

- The programming language must be widely supported and have a large developer community.
- The frontend language must be compatible with modern web browsers, including Firefox and Chromium.
- The language must be easy to learn and use, to allow for a range of skill levels among developers.
- The language must have good support for modern web technologies like HTML5 and CSS3.
- The language must be suitable for use in a PWA environment.

## Assumptions

- The use of JavaScript as a frontend programming language will enable the app to be developed quickly and efficiently.
- JavaScript has a large and active developer community, which will provide support and resources for the development of the app.
- The use of JavaScript will enable the creation of visually appealing and interactive user interfaces.

## Considered Alternatives

- Python: 
While Python is a widely-used and versatile language, it is not typically used for frontend development and may not have good support for modern web technologies.
- Java: 
Java is a popular and well-supported language, but it may not be as flexible and versatile as JavaScript for frontend development.
- Rust:
Rust is primarily used for creating backend systems, applications, and libraries. 
It is not typically used for frontend development, as it does not have built-in support for graphical user interface development.

## Decision

We will use JavaScript ([ES6](https://www.w3schools.com/js/js_es6.asp)) as the frontend programming language for app. 

## Rationale & Implications

JavaScript is a widely-used and well-supported language with a large and active developer community. 
It is also a highly flexible and versatile language, which makes it well-suited to a wide range of applications, including web-based applications like the Perma Plan(t) app. Additionally, JavaScript has good support for modern web technologies, which will enable the creation of visually appealing and interactive user interfaces for the app.
The version ES6 (ECMAScript 2015) introduces new syntax, enhanced object-oriented programming, improved asynchronous programming, and a native module system to JavaScript. 
These features can help developers write more efficient and maintainable code.

The app will be able to take advantage of the large ecosystem of libraries and resources available for JavaScript development.

## Related Decisions

 - The decision to support multiple platforms and browsers.
 - The decision to prioritize a smooth and interactive user experience.

## Notes
