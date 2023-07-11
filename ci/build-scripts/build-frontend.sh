#!/bin/bash

echo "building frontend"

# Echo on and fail fast
set -ex

cd ./frontend/

export VITE_BASE_API_URL="/"
export VITE_NEXTCLOUD_URI="https://cloud.permaplant.net"

# build node project
npm ci
npm run build
