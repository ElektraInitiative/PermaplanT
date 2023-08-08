## How to write tests

### Locator Guidelines

Before developing E2E tests make sure you have read the [locator guidelines](https://github.com/ElektraInitiative/PermaplanT/doc/guidelines/frontend-locators.md).

### General rules

- Be consistent and minimalistic.
  - Use the same vocabulary as playwright (click, visible, etc.)
  - Avoid using multiple different verbs for the same actions, keep your vocabulary small and precise.
    Use Playwrights vocabulary.
    This means to prefix methods with the actions from playwright (e.g when calling `xyz.click()` from playwright inside that method, name the method `click_xyz()` not a mix of press, click, push etc.)
  - Don't indent more than one time.
  - Don't make a complicated call stack higher than two from a page object.
- Every test should be independent from other tests (concurrency).
- Name inputs or objects you create SUT (System under Test) so they are clearly marked as test artifacts.

### A typical workflow

The usual workflow consists of three steps:

1. (`/features`) write a feature inside with one or multiple scenarios.
2. (`/pages`) implement the page object (if it doesn't already exist) in .
3. (`/steps`) create a function for each scenario step using the page objects.

Lets go over these steps in more detail.

### Writing .feature files

Make sure to have a solid understanding about the Gherkin syntax, so you don't fall into common pitfalls.
Usually the syntax is not very strict but poor Gherkin will cascade into the later processes of testing and make everything more complicated.

Avoid the following:

- Multiple Given, When or Thens in one scenario
- Too verbose/detailed sentences
- Describing the implementation (press, enter, type etc.)

If you are using more than one "Given-When-Then" You should probably split up your scenario.
Writing a feature file should not be underestimated.
Take your time in defining the problem.

Here are some good guidelines.

- https://automationpanda.com/2017/01/30/bdd-101-writing-good-gherkin/

- https://cucumber.io/docs/bdd/better-gherkin/

### Implementing Page Objects

ALL tests are performed exclusively with pageobjects, where the selectors and functions are defined inside a class.
If you are not familiar with the page object model look [here](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/) if you are familiar with the page object model, still have a look : ).
The pages are all instantiated globally inside `conftest.py` and injected into the step functions as arguments.
When using Playwright for python we are interacting with Playwrights [page class](https://playwright.dev/docs/api/class-page), which is basically representing a tab.
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

#### [Playwright Test generator](https://playwright.dev/python/docs/codegen)

This is the fastest way to get some locators and see how playwright would write the tests.
This should under no circumstances be copy pasted and put into a test but rather help you write the page objects.

Launch the playwright codegen from the terminal and create code that you can later refactor into your pageobjects.

```sh
playwright codegen http://localhost:5173/
```
