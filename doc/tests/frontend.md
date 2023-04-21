# Frontend testing

## Libraries

PermaplanT uses the [Jest](https://jestjs.io) testing framework.

[React Test Renderer](https://legacy.reactjs.org/docs/test-renderer.html), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [User Event](https://testing-library.com/docs/user-event/intro) are available as companion libraries.

## Types and organization of test

We distinguish three different kinds of tests in the frontend of PermaplanT. 

- Render tests
- DOM tests
- Logic tests

Each of these test-types may be used for unit testing or integration testing.

All tests related to a component can be found under the same directory in `<component name>.test.tsx`  

## Render tests

Render tests make use of [React Test Renderer](https://legacy.reactjs.org/docs/test-renderer.html) to check if a components layout has unexpectedly changed by transforming it to plain html.
Since most components are made up of other sub-components, most tests of this kind will considered to be integration tests.

After a new render test is run for the first time, [React Test Renderer](https://legacy.reactjs.org/docs/test-renderer.html) will record a snapshot of the selected component and store it in the `__snapshots__` subfolder.
If the same component renders differently in the future, e.g. because a subcomponent was changed, the test will fail.

To fix the issue, the programmer has to decide if the changes are intentional and then either fix the issue, or delete the old snapshot file, forcing [React Test Renderer](https://legacy.reactjs.org/docs/test-renderer.html) to create a new one on the next test run.

## DOM tests

DOM tests are used to test a components response to user interaction.
In the current test setup this is acomplished using a simulated DOM provided by [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and js-dom.
This makes it possible to run these tests without even when a browser is not available (e.g. as part of the CI-pipeline).

If possible, [User Event](https://testing-library.com/docs/user-event/intro) should be used to mock user input.

## Logic Tests

The remaining tests are used to test our frontends endpoints, helper functions and in general code that is not tied to the DOM.

[Jest](https://jestjs.io) provides plenty of APIs that can be used to mock functions and backend routes for this purpose. 