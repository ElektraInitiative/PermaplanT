# PermaplanT E2E tests

## Table of Contents

- [Directory structure](#directory-structure)
- [Coding Guidelines](#coding-guidelines)
- [Quickstart](#quickstart)
  - [Docker](#docker)
- [Environment Variables](#environment-variables)
- [Test Results](#test-results)
- [Test Reports](#test-reports)
- [Cleanup](#cleanup)
- [Optional arguments](#optional-arguments)
- [Other Documentations](#other-documentations)
  - [Playwright for Python](#playwright-for-python)
  - [Pytest-playwright](#pytest-playwright)
  - [Pytest-bdd](#pytest-bdd)
  - [Pytest-xdist](#pytest-xdist)

## Directory structure

```sh
├── features      Gherkin features
├── pages         Page object models
├── steps         The actual tests
├── conftest.py   Global pytest fixtures, functions.
├── test-reports  Pie charts, tables, runtime, etc.
├── test-results  Screenshots, videos, etc. (generated on execution)
```

## [Coding Guidelines](../doc/guidelines/e2e.md)

## Quickstart

Linux (Debian) is the OS under which these tests are developed and executed.
If you are confronting any issue on different OS, feel free to open a PR or contact someone.

### Pre-requisites

- All commands/scripts in this README are executed from this folder (`/e2e`).
- Make sure PermaplanT's frontend and backend is running.
- Make sure the [ENV](#environment-variables) variables are set according to your desire.
- Make sure you have a virtual environment as this will install all Python dependencies.
- Make sure `python` & `python3-pip` is installed

### Linux

Create and activate a python virtual environment

```sh
python3 -m venv venv
source venv/bin/activate
```

```sh
./install.sh
./e2e.sh
```

For a more detailed execution have a look [here](#optional-arguments)

### Windows

Have a look inside install.sh and e2e.sh and perform the same steps in your windows terminal.

### Docker

Assuming your app and database is on your localhost network.

```sh
docker build -t permaplant-e2e .
docker run --network="host" permaplant-e2e ./e2e.sh
```

The Jenkins pipeline performs exactly these two steps.
So running this dockerfile locally should mirror CI.

## Environment Variables

If any of the below mentioned variables are not set, the tests will fallback to defaults.

### E2E env variables

- `E2E_TIMEOUT` (default: `30000`)

  The timeout (in ms) for a single action (click, navigate, etc.).

- `E2E_URL` (default: `localhost:5173`)

  The url where the app is running.

- `E2E_USERNAME` (default: `Adi`)

  The username to login to permaplant.

- `E2E_PASSWORD` (default: `1234`)

  The password to login to permaplant.

### Project env variables

Furthermore following variables are expected to be set in your environment and required by `clean_db.py`:

- `POSTGRES_DB` (default: `permaplant`)
- `POSTGRES_USER` (default: `permaplant`)
- `POSTGRES_PASSWORD` (default: `permaplant`)
- `DATABASE_URL` (default: `postgres://permaplant:permaplant@db/permaplant`)
- `DATABASE_PORT` (default: `5432`)

## Cleanup

Currently we use [clean_db.py](clean_db.py) after or before tests to make sure all test maps are deleted.
If we dont delete them, some tests will fail trying to create a map that already exists.
This is automatically done with [e2e.sh](e2e.sh)`.

## Test Results

Test results are created after running the tests in `test-results/`.
This folder gets automatically created and deleted on test execution.
It will contain screenshots and videos about failed tests.

## Test Reports

Test reports are created at the end of tests in `test-reports/`.
There is a html and cucumber report.

### Cucumber Report

Reports are locally inside `/test-reports`.
In CI you can find the cucumber report in
and the HTML report inside

- python3 -m pytest --cucumberjson=./cucumber.json

### Html Report

- python3 -m pytest --html=test-reports/report.html --self-contained-html

## Optional arguments

If you dont like the default arguments in [e2e.sh](e2e.sh) you can execute the tests with pytest.

### Parallelization

Use as many processes as your computer has CPU cores.

```sh
python3 -m pytest -n auto
```

### Retries

```sh
python3 -m pytest --retries 3
```

### Single test

```sh
python3 -m pytest steps/test_login_logout.py
```

### Video capturing

```sh
python3 -m pytest --video on
```

Only on test failures.

```sh
python3 -m pytest --video retain-on-failure
```

## Other Documentations

### [Playwright for Python](https://playwright.dev/python/docs/intro)

### [Pytest-playwright](https://playwright.dev/python/docs/test-runners)

### [Pytest-bdd](https://pypi.org/project/pytest-bdd/)

#### Async

Async functions might be implemented in the future.
[PR](https://github.com/pytest-dev/pytest-bdd/pull/629)
[About asyncio with pytest-bdd](https://github.com/pytest-dev/pytest-bdd/issues/223)

### [Pytest-xdist](https://pytest-xdist.readthedocs.io/en/latest/index.html)
