FROM rust:1.67.1-slim

RUN apt update && apt install -y make libpq-dev libssl-dev pkg-config postgresql-client
RUN rustup component add clippy rustfmt
RUN cargo install --offline diesel_cli@2.0.1 --no-default-features --features postgres
RUN cargo install --offline typeshare-cli
RUN chown 47110:47110 -R /usr/local/cargo
