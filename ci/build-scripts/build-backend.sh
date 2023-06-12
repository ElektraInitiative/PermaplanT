#!/bin/bash

echo "building backend"

# Echo on and fail fast
set -ex

cd ./backend/

if [[ -f /opt/rust.env ]]
then
    source /opt/rust.env
fi

# Download Cargo Modules
cargo fetch

# Show Diesel Version
diesel --version

# Migrate DB
LC_ALL=C diesel migration run

# Create Bindings
typeshare ./ --lang=typescript --output-file=../frontend/src/bindings/definitions.ts

cargo build --release
