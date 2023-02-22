#!/bin/bash

echo "building frontend"
cd ./frontend/

# Echo on and fail fast
set -ex

npm ci
