#!/usr/bin/env bash

username=$1
password=$2

# Get the OAuth2 access token
access_token=$(curl --request POST \
    --url 'https://auth.permaplant.net/realms/PermaplanT/protocol/openid-connect/token' \
    --header 'content-type: application/x-www-form-urlencoded' \
    --data grant_type=password \
    --data "username=${username}" \
    --data "password=${password}" \
    --data 'client_id=localhost' | jq -r .access_token)

# Run httperf
httperf --server localhost --port 8080 --uri '/api/config' --num-conns 10000 --rate 100 --add-header="Authorization:Bearer ${access_token}\n" > backend/httperf.log 2>&1
