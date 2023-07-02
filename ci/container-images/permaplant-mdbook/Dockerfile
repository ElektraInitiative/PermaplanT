FROM rust:1.67.1-slim

ARG MDBOOK_VERSION="0.4.15"
ARG MDBOOK_MERMAID_VERSION="0.8.3"
ARG MDBOOK_LINKCHECK_VERSION="0.7.6"

RUN apt update && apt install -y libpq-dev
RUN cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
RUN cargo install mdbook-mermaid --vers ${MDBOOK_MERMAID_VERSION} --verbose
RUN cargo install mdbook --vers ${MDBOOK_VERSION} --verbose
RUN mkdir -p mdbook-linkcheck && cd "$_" && \
    curl -L https://github.com/Michael-F-Bryan/mdbook-linkcheck/releases/latest/download/mdbook-linkcheck.x86_64-unknown-linux-gnu.zip -o mdbook-linkcheck.zip && \
    unzip "$_" && \
    chmod +x mdbook-linkcheck && \
    export PATH=$PWD:$PATH && \
    cd ..
