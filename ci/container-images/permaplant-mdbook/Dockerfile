FROM rust:1.67.1-slim

RUN apt update && apt install -y libpq-dev
RUN cargo install mdbook
RUN cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
