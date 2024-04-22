# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
# docker build -t permaplant_mdbook .
FROM rust:1.67.1-slim-bookworm AS builder

ENV MDBOOK_VERSION=0.4.23 \
    MDBOOK_MERMAID_VERSION=0.12.6 \
    CARGO_NET_RETRY=10

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    sudo \
    tzdata \
    locales \
    ssh \
    make \
    curl \
    make \
    unzip \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set locale to en_US.UTF-8
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install mdbook pre-compiled binary
RUN curl -LO https://github.com/rust-lang/mdBook/releases/download/v$MDBOOK_VERSION/mdbook-v$MDBOOK_VERSION-x86_64-unknown-linux-gnu.tar.gz && \
    tar -xzf mdbook-v$MDBOOK_VERSION-x86_64-unknown-linux-gnu.tar.gz && \
    mv mdbook /usr/local/bin && \
    rm -rf mdbook-v$MDBOOK_VERSION-x86_64-unknown-linux-gnu.tar.gz && \
    mdbook --version

# Install mdbook-mermaid pre-compiled binary
RUN curl -LO https://github.com/badboy/mdbook-mermaid/releases/download/v$MDBOOK_MERMAID_VERSION/mdbook-mermaid-v$MDBOOK_MERMAID_VERSION-x86_64-unknown-linux-gnu.tar.gz && \
    tar -xzf mdbook-mermaid-v$MDBOOK_MERMAID_VERSION-x86_64-unknown-linux-gnu.tar.gz && \
    mv mdbook-mermaid /usr/local/bin && \
    rm -rf mdbook-mermaid-v$MDBOOK_MERMAID_VERSION-x86_64-unknown-linux-gnu.tar.gz && \
    mdbook-mermaid --version

# Install latest mdbook-linkcheck pre-compiled binary
RUN mkdir -p mdbook-linkcheck && cd mdbook-linkcheck && \
    curl -L https://github.com/Michael-F-Bryan/mdbook-linkcheck/releases/latest/download/mdbook-linkcheck.x86_64-unknown-linux-gnu.zip -o mdbook-linkcheck.zip && \
    unzip mdbook-linkcheck.zip && \
    chmod +x mdbook-linkcheck && \
    mv mdbook-linkcheck /usr/local/bin && \
    rm -rf mdbook-linkcheck && \
    mdbook-linkcheck --version

RUN cargo install --git https://github.com/ElektraInitiative/mdbook-generate-summary mdbook-generate-summary --locked

# Second stage: Final image
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y make

# Copy executables from the builder stage
COPY --from=builder /usr/local/bin/mdbook /usr/local/bin/mdbook
COPY --from=builder /usr/local/bin/mdbook-mermaid /usr/local/bin/mdbook-mermaid
COPY --from=builder /usr/local/bin/mdbook-linkcheck /usr/local/bin/mdbook-linkcheck
COPY --from=builder /usr/local/cargo/bin/mdbook-generate-summary /usr/local/bin/mdbook-generate-summary

ENV PERMAPLANT_PATH /home/batman/permaplant
WORKDIR $PERMAPLANT_PATH
COPY . $PERMAPLANT_PATH
