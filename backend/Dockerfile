# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
# docker build -t permaplant .
FROM rust:1.67.1-slim-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    DIESEL_CLI_VERSION=2.0.1 \
    TYPESHARE_CLI_VERSION=1.6.0 \
    RUSTFLAGS='-D warnings' \
    RUSTDOCFLAGS='-D warnings' \
    DATABASE_URL=postgres://ci:ci@db/cli \
    BIND_ADDRESS_HOST=127.0.0.1 \
    BIND_ADDRESS_PORT=8080 \
    AUTH_DISCOVERY_URI=unused \
    AUTH_CLIENT_ID=unused

# Set locale to en_US.UTF-8
RUN apt-get update && \
    apt-get install -y --no-install-recommends sudo tzdata locales ssh && \
    rm -rf /var/lib/apt/lists/*
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install packages
RUN set -eux; \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    make \
    libpq-dev \
    libssl-dev \
    pkg-config \
    xz-utils \
    postgresql-client \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install cargo packages
RUN cargo install diesel_cli@$DIESEL_CLI_VERSION --no-default-features --features postgres && \
    rustup component add clippy rustfmt && \
    # Set permissions
    chmod -R a+w $CARGO_HOME && chown 47110:47110 -R $CARGO_HOME

# Install typeshare pre-compiled binary
RUN curl -LO https://github.com/1Password/typeshare/releases/download/v$TYPESHARE_CLI_VERSION/typeshare-cli-v$TYPESHARE_CLI_VERSION-x86_64-unknown-linux-gnu.tar.xz && \
    tar -xJf typeshare-cli-v$TYPESHARE_CLI_VERSION-x86_64-unknown-linux-gnu.tar.xz && \
    cd typeshare-cli-v$TYPESHARE_CLI_VERSION-x86_64-unknown-linux-gnu && \
    mv typeshare /usr/local/bin && \
    typeshare --version

# One day install diesel_cli binary https://github.com/diesel-rs/diesel/issues/2379

# Sanity check
RUN rustup --version \
    cargo --version \
    rustc --version

ENV PERMAPLANT_PATH /home/batman/permaplant
WORKDIR $PERMAPLANT_PATH
COPY ./backend $PERMAPLANT_PATH
