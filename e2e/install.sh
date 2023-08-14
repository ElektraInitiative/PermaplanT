#!/bin/bash

# Detect package manager
if command -v apt &>/dev/null; then
    PM="apt"
elif command -v yum &>/dev/null; then
    PM="yum"
elif command -v dnf &>/dev/null; then
    PM="dnf"
else
    echo "Unsupported package manager."
    exit 1
fi
sudo "$PM" update
sudo "$PM" install python3 python3-venv

python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
python3 -m playwright install chromium --with-deps
