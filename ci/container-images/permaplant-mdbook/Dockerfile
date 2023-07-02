FROM rust:1.67.1-slim

ARG MDBOOK_LINKCHECK_VERSION="0.7.6"

RUN apt update && apt install -y libpq-dev
RUN cargo install mdbook mdbook-mermaid --verbose
RUN cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
RUN mkdir -p mdbook-linkcheck && cd "$_" && \
    curl -L https://github.com/Michael-F-Bryan/mdbook-linkcheck/releases/latest/download/mdbook-linkcheck.x86_64-unknown-linux-gnu.zip -o mdbook-linkcheck.zip && \
    unzip "$_" && \
    chmod +x mdbook-linkcheck && \
    export PATH=$PWD:$PATH && \
    cd ..
