#!/bin/bash
apt update
apt install python3
apt install python3-venv
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
python3 -m playwright install chromium --with-deps
