FROM rust:1.74-slim-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV RUSTFLAGS="-C link-arg=-fuse-ld=lld"
ENV NODE_VERSION 19.4
ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR

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
    wget \
    curl \
    git \
    make \
    strace \
    clang \
    lld \
    libpq-dev \
    libssl-dev \
    pkg-config \
    postgresql-client

RUN cargo install diesel_cli@2.0.1 --no-default-features --features postgres && cargo install typeshare-cli

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"

RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

RUN sudo git config --global --add safe.directory /workspaces/PermaplanT
