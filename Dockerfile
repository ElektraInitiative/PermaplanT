FROM node:20.3.1-slim

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=1.67.1 \
    DIESE_VERSION=2.0.1

RUN mkdir /.npm
RUN chown 47110:47110 -R /.npm

RUN set -eux; \
    apt-get update && \
    apt-get install -y \
    make curl gcc wget libssl-dev libpq-dev libssl-dev pkg-config postgresql-client build-essential ca-certificates

RUN curl --proto '=https' --tlsv1.2 -sSf -y https://sh.rustup.rs | sh
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
RUN rustup install $RUST_VERSION && rustup default $RUST_VERSION
RUN cargo install diesel_cli@${DIESE_VERSION} --no-default-features --features postgres
RUN cargo install typeshare-cli --no-default-features
RUN cargo install mdbook mdbook-mermaid
RUN cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
RUN rustup component add clippy rustfmt
RUN chmod -R a+w $RUSTUP_HOME $CARGO_HOME;
RUN chown 47110:47110 -R $CARGO_HOME
RUN rustup --version; \
    cargo --version; \
    rustc --version;\
    apt-get remove -y --auto-remove \
    wget \
    ; \
    rm -rf /var/lib/apt/lists/*;
