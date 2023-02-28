#!/bin/bash

echo "building backend"

# Echo on and fail fast
set -ex

cd ./backend/

source /opt/rust.env

# Download Cargo Modules
cargo fetch

# Migrate DB
LC_ALL=C diesel migration run

# Create Bindings
typeshare ./ --lang=typescript --output-file=../frontend/src/bindings/definitions.ts

cargo build --release
