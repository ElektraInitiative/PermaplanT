# E2E Testing

## Problem

There is currently no existing e2e tests locally and in the pipeline.
This allows for increased frontend bugs and regression.
It lacks profound decision making which framework to pick.

## Constraints

1. [Behavior-driven development](https://www.selenium.dev/documentation/test_practices/testing_types/#behavior-driven-development-bdd)
   - a) We want to have .feature files and stick to the Gherkin syntax.
2. [Page Object Design Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
   - a) A programming language that supports classes
3. The library must be free software.
4. Should be in Python due to simplicity and personal preference.
5. The framework must have an active community.
6. Simple is better than complex.
7. Headless browser support so we can run the tests in our automated pipeline.

## Assumptions

1. Understanding of BDD practices and principles, including writing feature files using the Gherkin syntax.
2. Familiarity with the Page Object Design Pattern and its implementation for creating modular and maintainable test code.
3. Knowledge of end-to-end testing concepts and best practices.
4. Basic understanding of Python programming language and its syntax.
5. Having heard of pytest and its usage for test execution and assertions.

## Solutions

### Alternative [Java](https://www.java.com/de/) + [Selenium](https://www.selenium.dev)

Java with Selenium is a popular and well-established choice for web test automation.
While it remains a reliable option, there are personal preferences and concerns about Oracle's licensing changes, and there are other languages that can do the same with less boilerplate.

### Alternative [Javascript](https://www.javascript.com) + [Playwright](https://playwright.dev)

JavaScript with Playwright is a powerful combination for web test automation.
However, concerns regarding potential code complexity and the temptation to write complicated workarounds influenced the decision to avoid JavaScript as the testing language.

### Alternative [Javascript](https://www.javascript.com) + [Cypress](https://www.cypress.io)

Similar to Playwright, Cypress is another JavaScript-based test automation framework.
However, it was not chosen due to the same concerns about JavaScript mentioned earlier.

### Alternative [Robot Framework](https://robotframework.org)

The Robot Framework, while supporting Python and following BDD principles, has its own syntax and separate resource file management, which contradicts the first constraint of the project.
Additionally, it has a steeper learning curve, which conflicts with the desire for an easy-to-learn solution.

### Alternative [Puppeteer](https://pptr.dev)

Puppeteer is a viable alternative to Playwright, as it also provides automation capabilities for Chrome and Chromium-based browsers.
However, the decision to use Python as the programming language led to the preference for Playwright for Python, which integrates well with Python's ecosystem.

### Alternative [Python](https://www.python.org) + [Selenium](https://www.selenium.dev) + [Behave](https://behave.readthedocs.io/en/latest/)

Python with the Behave framework is capable of fulfilling the requirements.
However, pytest-bdd was preferred over Behave due to its integration with pytest and the added feature of parallel test execution, which should give the low performance stack a slight boost.

## Decision

After careful consideration, the decision has been made to use [Python](https://www.python.org) as the programming language and [Playwright for Python](https://playwright.dev/python/docs/intro) as the test automation framework.
Python's readability, ease of use, and extensive ecosystem make it a solid choice for test automation.
Playwright for Python offers comprehensive browser automation capabilities, aligns well with Python's syntax and ecosystem, and satisfies the project's constraints and requirements.
Additionally, Playwright for Python provides a very clear documentation, which makes it easier for developers who are not so experienced with frontend testing, to get started quickly.

By leveraging Python and Playwright for Python, the project aims to achieve efficient and reliable web test automation with the support of an extensive and mature ecosystem.

Additionally we will need the following libraries:

- [Pytest](https://docs.pytest.org/en/7.4.x/)
- [Pytest-playwright](https://pypi.org/project/pytest-playwright/)
- [Pytest-bdd](https://pypi.org/project/pytest-bdd/)

## Rationale

### BDD

Behavior Driven development (BDD) is an agile software development methodology that aims to align the development process with the desired behavior of the software.
By using BDD, tests can be written in a format that is easily understood by domain experts, enabling the collaboration and effective communication between them and developers.
Given PermaplanT's close collaboration with permaculture domain experts, the adoption of BDD is beneficial for the project, as it enables clear communication and alignment between the development team and domain experts.
Additionally, BDD fits seamlessly with the already established agile development practices of the development team.

### POM

Page Object Models (POMs) are a valuable concept when it comes to improving code complexity in test automation.
POMs help to separate concerns and encapsulate the functionalities of individual pages or components.
This approach encourages developers to write more modular and maintainable code, as each page object represents a specific page or component and contains the associated actions and assertions.
By utilizing POMs, the codebase becomes more organized, easier to read, and simpler to maintain, ultimately enhancing the overall quality of the test automation framework.

## Implications

- Write Guidelines for writing these Tests (BDD/POM, TDD, etc.).
- Write Guidelines on how to write a testable frontend.

## Notes

This solution has probably a steep learning curve, but once getting the hang of it, implementing tests becomes very easy and it pays off.

#619
#611
#607

[@4ydan](https://github.com/4ydan)
