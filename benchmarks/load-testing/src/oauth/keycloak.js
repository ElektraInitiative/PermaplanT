import http from "k6/http";

/**
 * @function
 * @param  {string} authUrl
 * @param  {string} clientId
 * @param  {string} username
 * @param  {string} password
 */
export function authenticate(authUrl, clientId, username, password) {
  let response;

  const requestBody = {
    grant_type: "password",
    username: username,
    password: password,
    client_id: clientId,
  };

  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  response = http.post(authUrl, requestBody, params);

  return response.json();
}
