#!/bin/bash

echo "building backend"
cd ./backend/

source /opt/rust.env

export DATABASE_URL=postgres://cidb:cidb@127.0.0.1/cidb

# Echo on and fail fast
set -ex

# Reset Database
sudo /usr/local/bin/permaplant-reset-ci.sh

# Download Cargo Modules
cargo fetch

# Migrate DB
LC_ALL=C diesel migration run

# Create Bindings
typeshare ./ --lang=typescript --output-file=../frontend/src/bindings/definitions.ts
