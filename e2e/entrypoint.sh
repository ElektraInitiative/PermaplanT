#!/bin/bash

grep -E '^(E2E|POSTGRES)_[A-Z_]+=' .env

# Only run clean_db script
# when env variable CI is set
if [ -z "$CI" ]; then
    python3 clean_db.py
fi

# Run the pytest command
python3 -m pytest -n auto --retries 2 --video retain-on-failure --html=test-reports/report.html --self-contained-html --cucumberjson=test-reports/cucumber.json
