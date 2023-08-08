# PermaplanT E2E tests

All commands/scripts in this README are executed from this folder (/e2e).

## Directory structure

```sh
├── features      Gherkin features
├── pages         Page object models
├── steps         The actual tests
├── conftest.py   Global pytest fixtures, functions.
├── test-reports  Pie charts, tables, runtime, etc.
├── test-results  Screenshots, videos, etc.
```

## Environment Variables

All environment variables are optional, since they have defaults.
For type details and defaults see [constants.py](pages/constants.py)

- `E2E_URL`
  The url where the app is running.

- `E2E_USERNAME`
  The username to login to permaplant.

- `E2E_PASSWORD`
  The password to login to permaplant.

## Quickstart

- Make sure your app is running.
- Make sure the [ENV](#environment-variables) variables are set according to your desire.
- Make sure you have a virtual environment as this will install all python dependencies.

```sh
./install.sh
./e2e.sh
```

### Creating a virtual env

```sh
sudo apt update
sudo apt install python3
sudo apt install python3-venv
python3 -m venv venv
source venv/bin/activate
./install.sh
./e2e.sh
```

### Inside Docker

Assuming your app and database is on your localhost network.

```sh
docker build -t permaplant-e2e .
docker run --network="host" permaplant-e2e ./e2e.sh
```

The Jenkins pipeline performs exactly these two steps.
So running this dockerfile locally should mirror CI.

### Optional arguments

Most of these are already set inside [e2e.sh](e2e.sh).
Nevertheless, if you maybe want to build your own script, here are some pytest arguments.

#### Parallelization

Use as many processes as your computer has CPU cores.

```sh
python3 -m pytest -n auto
```

#### Retries

```sh
python3 -m pytest --retries 3
```

#### Single test

```sh
python3 -m pytest steps/test_login_logout.py
```

#### Video capturing

```sh
python3 -m pytest --video on
```

Only on test failures.

```sh
python3 -m pytest --video retain-on-failure
```

#### Flaky tests

If there is something suspicious going on.

```sh
set -e; for i in `seq 10`;do echo "Running iteration $i"; python -m pytest -n auto; done
```

### Cleanup

Currently we need to use [clean_db.py](clean_db.py) after/before tests to make all test maps are deleted.
If we dont delete them, some tests will fail trying to create a map that already exists.
This is automatically done inside [e2e.sh](e2e.sh)`.

## Coding Guidelines

You can find the coding guidelines [here](../doc/guidelines/e2e.md).

#### Reporting

- python3 -m pytest --cucumberjson=./cucumber.json
- python3 -m pytest --gherkin-terminal-reporter

#### Pytest-bdd Test generator

- pytest-bdd generate features/login_logout.feature > steps/test_some_feature.py

Only missing stuff:

- pytest --generate-missing --feature features steps/

## Other Documentations

### Playwright for Python Documentation

[https://playwright.dev/python/docs/intro](https://playwright.dev/python/docs/intro)

### Pytest-bdd Documentation

[https://pypi.org/project/pytest-bdd/](https://pypi.org/project/pytest-bdd/)

If we ever need async functions they might be implemented in the future.
[PR](https://github.com/pytest-dev/pytest-bdd/pull/629)
[about asyncio with pytest-bdd](https://github.com/pytest-dev/pytest-bdd/issues/223)
