#!/bin/bash

echo "building backend"
cd ./backend/

source /opt/rust.env

# Echo on and fail fast
set -ex

# Download Cargo Modules
cargo fetch

# Migrate DB
LC_ALL=C diesel migration run

# Create Bindings
typeshare ./ --lang=typescript --output-file=../frontend/src/bindings/definitions.ts

cargo build --release
