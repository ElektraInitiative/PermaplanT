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

# Loop to send requests
for (( i=1; i<=$number_of_requests; i++ ))
do
  # Generate a random number between 0 and 9810 (number of plants)
  ID=$(($RANDOM % 9810))

  # Execute httperf with the random ID and append to log file
  httperf --server localhost --port 8080 --uri /api/maps/1/layers/plants/relations?map_id=1\&plant_id=$ID --num-conns 1 --add-header="Authorization:Bearer ${access_token}\n" >> backend/httperf.log 2>&1
  let "sleep_time = 1 / $request_rate"
  sleep $sleep_time
done
