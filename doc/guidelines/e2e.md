## How to write tests

### Locator Guidelines

Before developing E2E tests make sure you have read the [locator guidelines](./frontend-locators.md).

### General rules

- Be consistent and minimalistic.
  - Don't use synonyms. Use the same vocabulary as Playwright (click, visible, etc.).
  - Avoid using multiple different verbs for the same actions, keep your vocabulary small and precise.
    Use Playwrights vocabulary.
    This means to prefix methods with the actions from Playwright (e.g when calling `xyz.click()` from Playwright inside that method, name the method `click_xyz()` not a mix of press, click, push etc.)
  - Don't indent more than one time.
  - Don't make a complicated call stack higher than two from a page object.
- Every test should be independent from other tests (concurrency).
- Name inputs or objects you create SUT (System under Test) so they are clearly marked as test artifacts.

### A typical workflow

The usual workflow consists of three steps:

1. (`/features`) write a feature with one or multiple scenarios.
2. (`/pages`) implement the page objects.
3. (`/steps`) create a function for each scenario step using the page objects.

Let us go over these steps in more detail.

### Writing .feature files

Make sure to have a solid understanding about the Gherkin syntax, so you don't fall into common pitfalls.
Usually the syntax is not very strict but poor Gherkin will cascade into the later processes of testing and make everything more complicated.

Here are some general guidelines for writing Gherkin.

- [automationpanda.com](https://automationpanda.com/2017/01/30/bdd-101-writing-good-gherkin/)

- [cucumber.io](https://cucumber.io/docs/bdd/better-gherkin/)

We have decided to use "I" instead of the third person.

### Implementing Page Objects

ALL tests are performed exclusively with page objects, where the selectors and functions are defined inside a class.
If you are not familiar with the page object model look [here](https://playwright.dev/python/docs/pom) if you are familiar with the page object model, still have a look : ).
The page objects are all instantiated globally inside `conftest.py` and injected into the step functions as arguments.
When using Playwright for Python we are interacting with Playwrights [page class](https://playwright.dev/docs/api/class-page), which is basically representing a tab.
This Playwright page class is then instantiated as a singleton and used globally across all OUR page objects to perform actions on the webapp.
It is crucial to pay close attention what the side effects of OUR page object methods are as some methods will change the webpage and you will have to use a different page object after.

**The Pagefactory does not exist yet** due to implementation difficulty and for flexible design at the start.
Just use the fixtures instead as they basically do the same.

### Creating steps with pytest-bdd

When implementing the test steps you should ONLY be invoking methods of page objects to reach your goal.
Implementing complex functionalities inside tests should be STRICTLY avoided and implemented into the corresponding page objects.

Following the [testing strategy](https://github.com/ElektraInitiative/PermaplanT/tree/master/doc/tests) from PermaplanT:

- Given should ARRANGE
- When should ACT
- Then should ASSERT

This will ensure the tests are simple and don't perform too much magic all over the place.

### Parallelization

[Pytest-xdist](https://pytest-xdist.readthedocs.io/en/latest/distribution.html) is used to parallelize the tests.
This is done to reduce the pipeline time, since many tests could make this stage take a long time at the end.
When developing tests always keep in mind that each scenario is running on a separate core and should not depend on results of other scenarios.
A scenario outlet will also start each scenario with one core.
Try to avoid too complex parallelization and we also probably don't need to assign and manage worker groups with additional xdist syntax.

### Helpful tools

#### [Playwright Test Generator](https://playwright.dev/python/docs/codegen)

This is the fastest way to get some locators and see how Playwright would write the tests.
This should under no circumstances be copy pasted and put into a test but rather help you write the page objects.

Launch it from the terminal and create code that you can later refactor into your page objects.

```sh
playwright codegen http://localhost:5173/
```

#### Pytest-bdd Test generator

- pytest-bdd generate features/login_logout.feature > steps/test_some_feature.py

Only missing stuff:

- pytest --generate-missing --feature features steps/
