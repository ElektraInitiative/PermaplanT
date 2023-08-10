# Authentication & Authorization

## Problem

The user wants to log in once and be able to fetch resources
from the Nextcloud instance as well as from PermaplanT database.
The users need to authenticate themself (who is the user).
Then they get the appropriate authorization (does the user have the right privileges) to perform the action.

**OAuth2.0:** **User** can authorize **client** to fetch resources from **resource server**.

**OpenID Connect:** Extension of OAuth2.0 for authentication

## Constraints

- single account to access PermaplanT and Nextcloud
- we don't implement our own auth solution

## Assumptions

- Nextcloud and PermaplanT backend are the only services we provide
- we don't need roles/scopes (everyone can access all parts of the API)
- access control is quite simple, e.g., which users can read or write on which map

## Solutions

### Nextcloud-only

OpenID Connect authentication & authorization flow with:

Authorization server: [Nextcloud OIDC App](https://github.com/H2CK/oidc)

Resource server 1: [Nextcloud OAuth2](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/oauth2.html)

Resource server 2: PermaplanT backend

Client: PermaplanT frontend

**Notes:**

> Currently it is not yet possible to use an issued Access Token or ID Token to access resources at the Nextcloud instance it self.

\- [H2CK/oidc](https://github.com/H2CK/oidc)

This is a major problem with this approach.

> Nextcloud OAuth2 implementation currently does not support scoped access.
> This means that every token has
> full access to the complete account including read and write permission to the stored files.
> It is essential to store the OAuth2 tokens in a safe way!
> Without scopes and restrictable access it is
> not recommended to use a Nextcloud instance as a user authentication service.

\- [Nextcloud documentation](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/oauth2.html)

### Nextcloud app password login flow

[App password login flow](https://docs.nextcloud.com/server/latest/developer_manual/client_apis/LoginFlow/index.html)

This is the login flow described in the Nextcloud documentation.
A client can retrieve an app password for a user.
Opposed to token authentication described before the app password
is permanent and should not be stored anywhere in the frontend.
This approach requires PermaplanT to have its own authentication server
and therefore separate accounts!

### Separate identity provider

OpenID Connect authentication & authorization flow with:

Authorization server / Idenentity provider: PermaplanT

Resource server 1: Nextcloud

Resource server 2: PermaplanT

Client 1: Nextcloud WebClient [with oidc login](https://github.com/pulsejet/nextcloud-oidc-login) or [user_oidc](https://github.com/nextcloud/user_oidc)

Client 2: PermaplanT

**Notes:**
In this approach the accounts are managed by PermaplanT,
therefore requires implementing an identity provider in PermaplanT.

This approach was tested with Keycloak as identity provider and [user_oidc](https://github.com/nextcloud/user_oidc)(official oidc app) for oidc capabilities in Nextcloud and works as intended.
The only limitation is that Nextcloud does not offer scoped access at the moment -> the authenticated app can access all of the resources the user has access to.

#### Identity providers

[comparison of identity providers](https://gist.github.com/bmaupin/6878fae9abcb63ef43f8ac9b9de8fafd)

## Decision

We will use oidc with the separate identity provider [Keycloak](https://www.keycloak.org/).

Keycloak itself will run as a separate service like Nextcloud. Users are created there instead of in Nextcloud/PermaplanT and users can then log in via Keycloak.

So in the PermaplanT frontend the user will be redirected to Keycloak. They can login in Keycloak and then they get redirected back to PermaplanT.
From then on all requests are authorized via JWT.
How that happens in detail is specified by the OAuth2 spec and there are also multiple ways of doing that.
We will use the recommended variant which is Authorization Code Flow with PKCE.
The backend will then simply validate the tokens and extract roles/user information out of them.
This will be done by either by a library or implemented by us as this part is not that complicated.

Keycloak itself can either run as an executable or as a container.
Apart from that it only requires a database so we can use our existing PostgreSQL for that.

### Rationale

> OpenID Connect is an interoperable authentication protocol based on the OAuth 2.0 family of specifications. It uses straightforward REST/JSON message flows with a design goal of “making simple things simple and complicated things possible”. It’s uniquely easy for developers to integrate, compared to any preceding Identity protocol.
> -- **[openid.net](https://openid.net/connect/faq/)**

Keycloak is a FLOSS solution for identity and access management which is one the most popular self hosted solutions. Some of the PermaplanT team members have already experience with it.

## Further Notes

There was an attempt to implement OIDC in nextcloud/server but the issue lost traction and was finally not merged because of missing integration tests (https://github.com/nextcloud/server/pull/12567)
