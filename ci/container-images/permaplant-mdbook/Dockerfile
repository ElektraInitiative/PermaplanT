FROM rust:1.67.1-slim-bookworm AS build

ARG MDBOOK_VERSION="0.4.15"
ARG MDBOOK_MERMAID_VERSION="0.8.3"
ARG MDBOOK_LINKCHECK_VERSION="0.7.6"

ENV CARGO_INSTALL_ROOT /usr/local/
ENV CARGO_TARGET_DIR /tmp/target/

RUN apt-get update && \
    apt-get install -y libssl-dev pkg-config ca-certificates build-essential make perl gcc libc6-dev

RUN apt update && apt install -y libpq-dev
RUN cargo install mdbook-mermaid --vers ${MDBOOK_MERMAID_VERSION} --verbose
RUN cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary
RUN cargo install mdbook-linkcheck --vers ${MDBOOK_LINKCHECK_VERSION} --verbose

# Create the final image
FROM ubuntu:20.04

LABEL maintainer="ghazani.aydan@gmail.com"
ENV RUST_LOG info

EXPOSE 3000

COPY --from=build /usr/local/bin/mdbook* /bin/

RUN apt-get update && apt-get install --no-install-recommends -y ca-certificates && rm -rf /var/cache/apt/lists

WORKDIR /data
VOLUME [ "/data" ]
