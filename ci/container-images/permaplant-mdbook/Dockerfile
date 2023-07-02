FROM rust:1.67.1-slim

ARG MDBOOK_MERMAID_VERSION="0.8.3"
ARG MDBOOK_LINKCHECK_VERSION="0.7.6"

RUN apt update && apt install -y libpq-dev
RUN cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
RUN cargo install mdbook-mermaid --vers ${MDBOOK_MERMAID_VERSION} --verbose
RUN cargo install mdbook-linkcheck --vers ${MDBOOK_LINKCHECK_VERSION} --verbose
