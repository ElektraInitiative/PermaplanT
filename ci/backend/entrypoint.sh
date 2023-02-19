#!/bin/bash

# We need to run the migrations on all container startups
# as the schema may have changed.

# Echo on and fail fast
set -ex

# Migrate DB
LC_ALL=C diesel migration run

# Create Bindings
typeshare ./ --lang=typescript --output-file=/bindings/definitions.ts

# Run Server
cargo run
