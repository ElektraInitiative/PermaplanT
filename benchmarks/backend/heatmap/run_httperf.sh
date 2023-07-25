#!/usr/bin/env bash

# Get the OAuth2 access token
username=$1
password=$2
access_token=$(curl --request POST \
    --url 'https://auth.permaplant.net/realms/PermaplanT/protocol/openid-connect/token' \
    --header 'content-type: application/x-www-form-urlencoded' \
    --data grant_type=password \
    --data "username=${username}" \
    --data "password=${password}" \
    --data 'client_id=localhost' | jq -r .access_token)

# Run httperf
httperf --server localhost --port 8080 --uri '/api/maps/1/layers/plants/heatmap?plant_id=1&plant_layer_id=2&shade_layer_id=3' --num-conns $3 --rate $4 --add-header="Authorization:Bearer ${access_token}\n" > backend/httperf.log 2>&1
