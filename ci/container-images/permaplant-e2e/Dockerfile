FROM mcr.microsoft.com/playwright/python:v1.35.0-jammy

USER root
RUN apt-get update && apt install -y git make
RUN python -m pip install playwright pytest pytest-playwright pytest-bdd mypy pytest-xdist
RUN python -m playwright install --with-deps
