FROM rust:1.67.1-slim

RUN apt update && apt install -y libpq-dev curl pkg-config ca-certificates build-essential make perl gcc libc6-dev
RUN cargo install mdbook mdbook-mermaid --verbose
RUN cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
RUN cargo install mdbook-linkcheck
