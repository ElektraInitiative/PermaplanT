FROM mcr.microsoft.com/devcontainers/rust:1-1-bullseye

# Include lld linker to improve build times either by using environment variable
# RUSTFLAGS="-C link-arg=-fuse-ld=lld" or with Cargo's configuration file (i.e see .cargo/config.toml).
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
   && apt-get -y install clang lld libpq-dev libssl-dev pkg-config postgresql-client python3-pip\
   && apt-get autoremove -y && apt-get clean -y

RUN rustup component add clippy rustfmt
RUN cargo install diesel_cli@2.0.1 --no-default-features --features postgres
RUN cargo install typeshare-cli
