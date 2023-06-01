# Quality Requirements

## Backend Tests

Tests are split into unit and integration tests (see [here](/doc/tests/) for reference).

Integration tests can be found in [test/](/backend/src/test/).  
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

More details about documentation can be found in the [contribution docs](/doc/contrib/frontend.md#documentation)
