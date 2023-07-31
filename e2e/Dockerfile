FROM mcr.microsoft.com/playwright/python:v1.35.0-jammy

USER root

ENV TEST_URL=http://pr.permaplant.net
ENV PERMAPLANT_PATH /home/batman/permaplante2e
WORKDIR $PERMAPLANT_PATH
COPY . $PERMAPLANT_PATH

RUN apt-get update && apt install -y git make
RUN python -m pip install -r requirements.txt
RUN python -m playwright install --with-deps
