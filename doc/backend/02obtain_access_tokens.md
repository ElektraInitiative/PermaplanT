# How to obtain access tokens?

In this guide it will be explained how to obtain access tokens and make requests to the backend while developing.

Be careful not to leak your username/password or access_token during the following steps.

## Using [Postman](https://www.postman.com/)

- Open Postman.
- Create a new request.
  - Enter the URL <http://localhost:8080/api/config> and execute the request.  
    This should now execute without errors.
  - Enter <http://localhost:8080/api/seeds>.  
    You should get a status code `401 Unauthorized`.
- Click the `Authorization` tab and select `OAuth 2.0`.
  - Chose `Grant Type` `Authorization Code`.
  - Set `Callback URL` to <http://localhost:5173/>.
  - Set `Auth URL` to <https://auth.permaplant.net/realms/PermaplanT/protocol/openid-connect/auth>.
  - Set `Access Token URL` to <https://auth.permaplant.net/realms/PermaplanT/protocol/openid-connect/token>.
  - Set `Client ID` to `localhost`.
  - Click `Get New Access Token` at the bottom.
    - Postman should now open a browser window.
    - Enter your credentials.
    - There should now be a window displaying `Authentication complete`.
    - Once it closes click `Use Token`.
- You should now be able to execute the request to <http://localhost:8080/api/seeds> in Postman.

A more in depth explanation about Postman and `OAuth 2.0` can be found in the [Postman documentation](https://learning.postman.com/docs/sending-requests/authorization/oauth-20/).

## Using Curl

The following request should work without problems:  
`curl 'http://localhost:8080/api/config' -f`

The following request should fail:  
`curl 'http://localhost:8080/api/seeds' -f`

We need to obtain an access token before we are able to make requests to secured endpoints via curl.  
We can do this using the [Resource Owner Password Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/resource-owner-password-flow):

```bash
curl --request POST \
  --url 'https://auth.permaplant.net/realms/PermaplanT/protocol/openid-connect/token' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data grant_type=password \
  --data 'username={username}' \
  --data 'password={password}' \
  --data 'client_id=localhost'
```

The response should be JSON containing a key `access_token`.  
Copy the access token.  
You can now make the request like the following:  
`curl 'http://localhost:8080/api/seeds' -H "authorization: Bearer {access_token}"`

Note that the token is only valid for 5 minutes after which you have to refresh it with the same curl command again.

## Other ways

You can find other ways of obtaining tokens using the Resource Owner Password Flow [here](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-resource-owner-password-flow#example-post-to-token-url).
