#!/bin/bash

echo "building storybook"

# Echo on and fail fast
set -ex

cd ./frontend/

# build node project
npm run doc
npm run build-storybook
