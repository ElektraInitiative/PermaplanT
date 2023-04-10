#!/bin/bash

echo "building schema only"

# Echo on and fail fast
set -ex

cd ./backend/

if [[ -f /opt/rust.env ]]
then
    source /opt/rust.env
fi

# Migrate DB and create schema.rs
LC_ALL=C diesel migration run

# Create Bindings
typeshare ./ --lang=typescript --output-file=../frontend/src/bindings/definitions.ts
