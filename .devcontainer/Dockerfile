# This Dockerfile is used inside the docker-compose.yml as development environment
ARG VARIANT="ubuntu-22.04"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

ENV DEBIAN_FRONTEND=noninteractive
# Include lld linker to improve build times either by using environment variable
# RUSTFLAGS="-C link-arg=-fuse-ld=lld" or with Cargo's configuration file (i.e see .cargo/config.toml).
ENV RUSTFLAGS="-C link-arg=-fuse-ld=lld"

RUN apt-get update \
    && apt-get -y install make \
    python3-pip \
    clang \
    lld \
    libpq-dev \
    libssl-dev \
    pkg-config \
    postgresql-client \
    && apt-get autoremove -y \
    && apt-get clean -y
