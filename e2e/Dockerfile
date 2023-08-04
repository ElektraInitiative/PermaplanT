# docker build -t permaplant-e2e .
# docker run permaplant-e2e
FROM mcr.microsoft.com/playwright/python:v1.35.0-jammy
RUN apt-get update && apt install -y git make
USER root

ENV PERMAPLANT_PATH /home/batman/permaplant/e2e
WORKDIR $PERMAPLANT_PATH
COPY . $PERMAPLANT_PATH

RUN ./install.sh
