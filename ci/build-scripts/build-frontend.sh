#!/bin/bash

echo "building frontend"

# Echo on and fail fast
set -ex

cd ./frontend/

export VITE_BASE_API_URL=""

# build node project
npm ci
npm run build
