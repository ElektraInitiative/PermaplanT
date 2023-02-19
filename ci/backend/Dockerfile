FROM rust:1.67-slim

VOLUME /bindings

ENV DATABASE_URL=postgres://permaplant:permaplant@127.0.0.1/permaplant
ENV BIND_ADDRESS_HOST=127.0.0.1
ENV BIND_ADDRESS_PORT=8080

EXPOSE 8080/tcp

WORKDIR /code
RUN cargo init
COPY backend/Cargo.toml /code/Cargo.toml
RUN cargo fetch
COPY ./backend/ /code

RUN apt update && apt install -y libpq-dev

RUN cargo install diesel_cli --no-default-features --features postgres
RUN cargo install typeshare-cli

COPY ./ci/backend/entrypoint.sh /code/entry.sh
ENTRYPOINT /code/entry.sh
