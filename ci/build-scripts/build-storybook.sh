#!/bin/bash

echo "checking storybook"

# Echo on and fail fast
set -ex

cd ./frontend/

echo "Node.js version is $required_version. Proceeding with the script..."

# build node project
npm ci
npm run doc
npm run build-stroybook
