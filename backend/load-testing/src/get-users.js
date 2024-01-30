// Load test for the get-users endpoint.
// This test exists to test if the communication between API & Keycloak is efficient.

import http from "k6/http";
import { sleep } from "k6";

import { authenticate } from "./oauth/keycloak.js";

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 50,
  // A string specifying the total duration of the test run.
  duration: "1m30s",
};

export function setup() {
  return authenticate(
    "http://localhost:8081/realms/PermaplanT/protocol/openid-connect/token",
    "PermaplanT",
    "test",
    "test"
  );
}

export default function (data) {
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.access_token}`,
    },
  };

  let response = http.get("http://localhost:8080/api/users", params);
  console.log(response);
  sleep(1);
}
