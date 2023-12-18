# docker build -t permaplant-node -f ci/container-images/permaplant-node/Dockerfile .
FROM node:20.10.0-slim

RUN mkdir /.npm /.cache /.java-caller
RUN chown 47110:47110 -R /.npm /.cache /.java-caller

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    pre-commit && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g checksum

ENV PERMAPLANT_PATH /home/batman/permaplant
WORKDIR $PERMAPLANT_PATH
COPY . $PERMAPLANT_PATH
