# E2E Testing

as of 12.07.2023

## Problem

There is currently no existing e2e tests locally and in the pipeline.
It lacks profound decision making which framework to pick and the frontend team needs to be d'accord with it.

## Constraints

1. [Behaviour-driven development](https://www.selenium.dev/documentation/test_practices/testing_types/#behavior-driven-development-bdd)
2. [Page Object Design Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
3. Fast and easy prototyping of the tests

## Assumptions

- Understanding about BDD practices.
- Understanding about the Page Objects Design Pattern.
- Understanding about end-to-end tests.

## Decision Constraints/Design

### BDD

Behaviour Driven development (BDD) is an Agile software development methodology which reflects the behaviour a user expects to see in an application into the design process of the software.
It also encourages collaboration between developers and non-technical participants.
The behaviour is documented in separated files, typically with the ending .features.

E.g

login_logout.feature

```
Feature: Login

    I want to login on PermaplanT

    Background:
      Given I am on the PermaplanT homepage
      And the login button is visible

    Scenario: Wrong password
        When I press the login button
        Then I get navigated to the login page
        When I type in wrong credentials
        Then I should see 'E-mail or password is incorrect'

    Scenario: I can successfully login
        When I press the login button
        Then I get navigated to the login page
        When I type in my username and password
        Then I get redirected to the homepage
        And I see a Hello message
```

This approach decouples domain from testing and it fits perfectly to the current development workflow of PermaplanT.
With dependency injection you can then write tests for each statement.

### POM

Page Object Models (POM's) are very useful when it comes to making code more readable, maintanable and extendable.
Each Page object captures the functionalities of one single page.

```
class Searchpage:
    def __init__(self, page):
        self.page = page
        self.search_term_input = page.locator('[aria-label="Enter your search term"]')

    def navigate(self):
        self.page.goto("https://bing.com")

    def search(self, text):
        self.search_term_input.fill(text)
        self.search_term_input.press("Enter")
```

### Fast and easy prototyping of the tests

Frontend tests can cost a lot of time and effort to develop.
Python is a good fit to keep them simple and not overengineered, whilest creating them fast with every iteration.
Given BDD and POM, it is allowing us to not only be simple but also readable, maintanable, explicit, etc.. ().
Python fits perfectly with the above mentioned design decision and contributes to their philosphy (As long as we don't have performance issues or constraints).

### Considered Alternatives

#### Capture/Replay

Because they are easily broken by changing elements on a webpage.

#### Assert page by screenshots

Too much effort and could be flaky. Also bad for testing user interaction.

## Decision Language

[Python](https://www.python.org) as programming language.

### About the language:

One would typically chose Java with Selenium for this testing approach but we went with python.
[Why?](#fast-and-easy-prototyping-of-the-tests)
It is also very newcomer friendly, easy and has a big and still growing community.

### Considered Alternatives

#### [Java](https://www.java.com/de/)

Because you can do the same in python with less lines of code.

#### [Javascript](https://www.javascript.com)

Same as java.

## Decision libraries:

- [Playwright for Python](https://playwright.dev/python/docs/intro)
- [Pytest](https://docs.pytest.org/en/7.4.x/)
- [Pytest-playwright](https://pypi.org/project/pytest-playwright/)
- [Pytest-bdd](https://pypi.org/project/pytest-bdd/)
- [mypy](https://mypy-lang.org)

### About the libraries:

Most libraries offer more than we need.
Some offer a bit less but it's mostly about:

- Cross-browser
- Cross-platform
- Cross-language
- Auto-wait
- Tracing
- Screenshots
- Diagrams
- Codegen/Recording
- etc...

What we need:

- BDD support
- Python binding
- headless browser (which I think everyone has?)

What is nice to have:

- Auto-wait
- Screenshots
- Diagrams

All of them would fit our constraints, so at the end it was between the two giants Selenium and Playwright.
We chose Playwright because it allows us to get elements by text instead of css selectors.
We need headless browser support, so we can run the tests in our pipeline.

### Considered Alternatives

#### [Selenium](https://github.com/SeleniumHQ/selenium)

Selenium is the older framework with the bigger community, but we decided against it, because we are already in the ecosystem of playwright, with our performance tests, and playwright is trending.

#### [SeleniumBase](https://github.com/seleniumbase/SeleniumBase)

SeleniumBase is a handy extension of the python bindings for selenium.
It has very high code coverage and simplifies the selenium python bindings by alot but because of the decision for playwright and that it is only maintained by one guy, we decided against it.

#### [Cypress](https://github.com/cypress-io/cypress)

Pure javascript.

#### [Puppeteer](https://github.com/cypress-io/cypress)

No official python bindings.

[@4ydan](https://github.com/4ydan)
