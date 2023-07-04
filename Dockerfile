# docker run --name some-postgis -p 5432:5432 ^
# -e POSTGRES_USER=permaplant ^
# -e POSTGRES_DB=permaplant ^
# -e POSTGRES_PASSWORD=permaplant ^
# -e BIND_ADDRESS_HOST=0.0.0.0 ^
# -e BIND_ADDRESS_PORT=8080 ^
# -d postgis/postgis:13-3.1
#
# docker build -t test . --no-cache
#
FROM rust:1.67.1-slim AS bindings-builder
WORKDIR /build
COPY ./frontend /frontend
COPY ./backend /build
RUN cargo install typeshare-cli
RUN typeshare ./ --lang=typescript --output-file=./definitions.ts

FROM bindings-builder AS rust-builder
ENV DEBIAN_FRONTEND=noninteractive
ENV PROFILE="release"
ENV POSTGRES_USER=permaplant
ENV POSTGRES_DB=permaplant
ENV POSTGRES_PASSWORD=permaplant
ENV PGPASSWORD=permaplant
ENV DATABASE_URL=postgres://permaplant:permaplant@172.17.0.2/permaplant
ENV BIND_ADDRESS_HOST=0.0.0.0
ENV BIND_ADDRESS_PORT=8080
RUN apt-get update && \
    apt-get install -y \
    libpq-dev libssl-dev pkg-config postgresql-client
WORKDIR /build
RUN cargo install diesel_cli@2.0.1 --no-default-features --features postgres
RUN rustup component add clippy rustfmt
RUN diesel database reset
RUN LC_ALL=C diesel setup
RUN LC_ALL=C diesel migration run
RUN cargo build --release --no-default-features

FROM node:slim AS node-builder
RUN mkdir /.npm
RUN chown 47110:47110 -R /.npm
WORKDIR /build
COPY ./frontend /build
COPY --from=bindings-builder /build/definitions.ts ./src/bindings/definitions.ts
RUN npm ci
RUN npm run build

FROM debian:bullseye-slim
RUN apt-get update
WORKDIR /app
COPY --from=rust-builder /build/target/release/ ./target/release/
COPY --from=node-builder /build/node_modules/ ./node_modules/
