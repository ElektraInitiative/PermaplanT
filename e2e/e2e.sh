#!/bin/bash

# Run the pytest command
python3 -m pytest -n auto --retries 2 --video retain-on-failure --html=test-reports/report.html --self-contained-html --cucumberjson=test-reports/cucumber.json
