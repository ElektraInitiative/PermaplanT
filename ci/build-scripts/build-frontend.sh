#!/bin/bash

echo "building frontend"
cd ./frontend/

# Echo on and fail fast
set -ex

# build node project
npm ci
npm run build
