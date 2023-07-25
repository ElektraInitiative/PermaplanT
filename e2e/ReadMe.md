# PermaplanT E2E tests with Playwright for python and pytest-bdd

## Guidelines

link TBD

## Directory structure

```sh
├── features  Bdd features
├── pages     Page object models
├── steps     The actual tests
```

## Installation

### inside the devcontainer

in /workspaces/PermaplanT/e2e $

```sh
./install.sh
```

### with python venv

in /workspaces/PermaplanT/e2e $

```sh
sudo apt update
sudo apt install python3
sudo apt install python3-venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install --with-deps
```

## Quickstart

To run all tests with as many processes as your computer has CPU cores

```sh
python3 -m pytest --numprocesses auto
```

To run specific tests

```sh
python3 -m pytest --numprocesses auto steps/test_login_logout.py
```

To capture video when testing

```sh
python3 -m pytest --numprocesses auto --video on
```

To capture video only on failure

```sh
python3 -m pytest --numprocesses auto --video retain-on-failure
```

## ENV Variables

### TEST_URL

The url under wich the tests look for the website.
Defaults to `localhost:5173`

## How to write tests

### Before we start

- Be consistent.
- Use the same vocabulary as playwright(click, visible, etc.)
- Avoid using mutiple different verbs for the same actions, keep your vocabulary small and precise.
- Be minimalistic.

### A typical workflow

The usual workflow consists of:

- write a feature inside `/features` with one or multiple scenarios.
- implement the page object if it doesnt exist yet in `/pages`.
- write the steps that are connected to the gherkin syntax with pytest-bdd inside `/steps`.

Lets go over these steps one by one.

### Writing .feature files

This is an optional step, since it is possible that someone else has already written it for you.
If not, make sure to have a good understanding about Gherkin.

Avoid the following:

- Multiple Given, When or Thens
- Too verbose/detailed
- Describing the implementation (press, enter, type etc.)

If you are using more than one "Given-When-Then" You should probably split up your scenario.
Writing a feature file should not be underestimated.
Take your time in defining the problem.

Here are some good guidelines.

- https://automationpanda.com/2017/01/30/bdd-101-writing-good-gherkin/

- https://cucumber.io/docs/bdd/better-gherkin/

### Implementing a pageobject

The tests are performed with pageobjects, where the selectors and functions are inside a class.
Have a look [here](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/) for more information about page object models.
The Pagefactory does not exist yet.

### Creating the steps with pytest-bdd

TBD

### Helpful tools

#### Playwright Test generator

This is the fastest way to generate some prototypes and get some locators.
Launch the playwright codegen from the terminal and create code that you can later refactor into your pageobjects.

```sh
playwright codegen http://localhost:5173/
```

More information [here](https://playwright.dev/python/docs/codegen).

## Other Documentations

### Playwright for Python Documentation

[https://playwright.dev/python/docs/intro](https://playwright.dev/python/docs/intro)

### pytest-bdd Documentation

[https://pypi.org/project/pytest-bdd/](https://pypi.org/project/pytest-bdd/)

## Features

### Video capturing

- python3 -m pytest e2e/ --video on

only on failure

- python3 -m pytest e2e/ --video retain-on-failure

### Reporting

- python3 -m pytest --cucumberjson=./test.json
- python3 -m pytest --gherkin-terminal-reporter

### Testcode generator

- pytest-bdd generate features/login_logout.feature > tests/test_some.py

or only missing stuff

- pytest --generate-missing --feature features tests/
