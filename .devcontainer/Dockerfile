# This Dockerfile is used inside the docker-compose.yml as development environment
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
# Include lld linker to improve build times either by using environment variable
# RUSTFLAGS="-C link-arg=-fuse-ld=lld" or with Cargo's configuration file (i.e see .cargo/config.toml).
ENV RUSTFLAGS="-C link-arg=-fuse-ld=lld"

RUN apt-get update && \
    apt-get install -y --no-install-recommends sudo tzdata locales ssh && \
    rm -rf /var/lib/apt/lists/*

RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    git \
    make \
    strace \
    python3-pip \
    clang \
    lld \
    libpq-dev \
    libssl-dev \
    pkg-config \
    postgresql-client \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

RUN sudo git config --global --add safe.directory /workspaces/PermaplanT
