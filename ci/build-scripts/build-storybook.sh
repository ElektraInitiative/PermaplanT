#!/bin/bash

echo "checking storybook"

# Echo on and fail fast
set -ex

cd ./frontend/

# build node project
npm run doc
npm run storybook
