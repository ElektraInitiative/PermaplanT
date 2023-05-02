FROM rust:1.67.1-slim

RUN apt update && apt install -y libpq-dev libssl-dev
RUN rustup component add clippy rustfmt
RUN cargo install diesel_cli --no-default-features --features postgres
RUN cargo install typeshare-cli
RUN chown 47110:47110 -R /usr/local/cargo
