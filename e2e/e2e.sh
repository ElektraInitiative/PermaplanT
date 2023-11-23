#!/bin/bash

python3 clean_db.py
python3 -m pytest -n auto --reruns 2 --reruns-delay 5 --rerun-except AssertionError --video retain-on-failure --html=test-reports/report.html --self-contained-html --cucumberjson=test-reports/cucumber.json
