# HTTP Headers

This document explains the [HTTP request headers](https://developer.mozilla.org/en-US/docs/Glossary/Request_header) used by the backend.

## Authorization

The Authorization header is used for authentication/authorization.
The access token should be set either by the frontend or manually when making requests with for example curl.

For instructions on obtaining and using an access token, refer to [this document](./02obtain_access_tokens.md).

## Language etc.

Are not sent nor used, as the backend is agnostic to it.
