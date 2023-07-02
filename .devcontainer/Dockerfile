FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV RUSTFLAGS="-C link-arg=-fuse-ld=lld"

RUN apt-get update && \
    apt-get install -y --no-install-recommends sudo tzdata locales ssh && \
    rm -rf /var/lib/apt/lists/*

RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    sudo \
    curl \
    git \
    make \
    strace \
    python3-pip \
    clang \
    lld \
    libpq-dev \
    libssl-dev \
    pkg-config \
    postgresql-client

RUN curl --proto '=https' --tlsv1.2 -sSf -y https://sh.rustup.rs | sh
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

ENV PATH="/root/.cargo/bin:${PATH}"

RUN cargo install diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli

RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

RUN sudo git config --global --add safe.directory /workspaces/PermaplanT
