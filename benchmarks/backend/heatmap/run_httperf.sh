#!/usr/bin/env bash

username=$1
password=$2
number_of_requests=$3
request_rate=$4

# Get the OAuth2 access token
access_token=$(curl --request POST \
    --url 'https://auth.permaplant.net/realms/PermaplanT/protocol/openid-connect/token' \
    --header 'content-type: application/x-www-form-urlencoded' \
    --data grant_type=password \
    --data "username=${username}" \
    --data "password=${password}" \
    --data 'client_id=localhost' | jq -r .access_token)

# Run httperf
httperf --server localhost --port 8080 --uri '/api/maps/1/layers/plants/heatmap?plant_id=1&plant_layer_id=2&shade_layer_id=3' --num-conns $number_of_requests --rate $request_rate --add-header="Authorization:Bearer ${access_token}\n" > backend/httperf.log 2>&1
