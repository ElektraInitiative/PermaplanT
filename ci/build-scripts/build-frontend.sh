#!/bin/bash

echo "building frontend"

# Echo on and fail fast
set -ex

cd ./frontend/

# build node project
npm ci
npm run build
