# Backend Testing

## Auth

As Actix is validating tokens in integration tests you need to send authenticated requests.  
To do that use the token provided by the function `init_test_app` and insert it into the Authorization header.

There is no need for an authorization server during tests.  
The token will be created using a jwk that was specifically created for tests.
The same jwk will be used to validate the tokens.
