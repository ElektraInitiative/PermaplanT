# Quality

## efficient

- At least 3000 users should be able to connect to the backend.
- Keyboard shortcuts should be consistent.
- Startup time should be less than one second.
- Near instant search results.
- Should work with 500MB RAM.
- Good carbon emission efficiency: code burning more than 10% CPU should be optimized.

## usable

- Compliance with UI styleguide.
- Keyboard shortcuts should be consistent.
- Easily understandable acceptance test cases.
- Usability tests with gardeners.
- Avoidance of errors and understandable error messages.
- Usable despite color blindness.
- Usable with gloves.

## secure

- Avoid common vulnerabilities
- Use reliable software for security concerns
- Everything encrypted (https)
- Only encrypted or local storage
- Only authenticated users can access non-public data

## operable

- 99% uptime
- Only a few configuration options to keep it simple and everything configurable via `.env`
- Everything should build and run on Linux and the CI
- System can run for more than a month without a reboot needed

## flexible

One of our least important goals.
Users or programmers do not need simple ways to extend PermaplanT or to change features.
The only quality requirement we have are:

- usage in different browsers, including tablets
- localized to German and English

## Backend Tests

Tests are split into unit and integration tests (see [here](../tests/) for reference).

Integration tests can be found [here](https://github.com/ElektraInitiative/PermaplanT/tree/master/backend/src/test).  
Unit tests can be found in the modules they are supposed to test.

## Code documentation

The code documentation of the backend can be built using `cargo doc --open`.

You can find a more detailed explanation of which modules do what there.

## API documentation

The API documentation can be viewed by running the backend with `cargo run` and then navigating to <http://localhost:8080/doc/api/swagger/ui/>.  
It is automatically built using [utoipa](https://github.com/juhaku/utoipa).

## Frontend Code Documentation

The code in the frontend is documented by two different mechanisms.
On the one hand components are documented via storybook, on the other hand the public API of a feature, shared hook or utility, etc. should be documented by doc comments.
We use TypeDoc to extract the documentation from code comments.
More details about supported tags and syntax can be found in the [TypeDoc documentation](https://typedoc.org/guides/doccomments/).

The code documentation of the frontend can be generated via the command `npm run doc`.
Under the hood, this command executes TypeDoc that generates `.mdx` files to be viewed in storybook.

Afterwards it can be opened in storybook via the command `npm run storybook`.

More details about documentation can be found in the [contribution docs](../contrib/frontend.md#documentation)
