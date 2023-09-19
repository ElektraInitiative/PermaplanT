#!/bin/bash
rm -rf e2e/venv
python3 -m playwright uninstall
python3 -m pip uninstall -y -r requirements.txt
