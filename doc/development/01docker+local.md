# Docker + local

Run the database in Docker and the frontend and backend locally.

## Install Docker

[Install Docker](https://docs.docker.com/engine/install/) for your host OS.

## Installing Node + Npm

Make sure node, in the version as required for PermaplanT, is installed, you may use to easily install multiple versions of node [nvm](https://github.com/nvm-sh/nvm), use apt or [download node directly](https://nodejs.org/en/download).

## Install Rust

Follow the steps to [install Rust using rustup](https://www.rust-lang.org/tools/install).

## Run the database

This runs the Postgis database and PgAdmin.

```bash
cd docker
docker compose up -d
```
