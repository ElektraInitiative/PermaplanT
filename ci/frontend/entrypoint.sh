#!/bin/bash

set -ex

# import typeshare definition from bindings mount (see backend container)
if [[ ! -f /bindings/definitions.ts ]]
then
    echo "Couldn't find definitions.ts"
    exit 1
fi

mkdir /code/src/bindings
cp /bindings/definitions.ts /code/src/bindings/definitions.ts

npm run dev
