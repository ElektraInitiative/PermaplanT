# Authentication & Authorization

## Problem
The user wants to log in once and be able to fetch resources
from the Nextcloud instance as well as from PermaplanT database.
The user needs to authenticate themself (who is the user)
and get the appropriate authorization (does the user have the right priviliges)
to perform the action.

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

### Alternative A
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

### Alternative B
[App password login flow](https://docs.nextcloud.com/server/latest/developer_manual/client_apis/LoginFlow/index.html)

This is the login flow described in the Nextcloud documentation.
A client can retrieve an app password for a user.
Opposed to token authentication described before the app password
is permanent and should not be stored anywhere in the frontend.
This approach requires PermaplanT to have its own authentication server
and therefore seperate accounts!

### Alternative C
OpenID Connect authentication & authorization flow with:

Authorization server: PermaplanT

Resource server 1: Nextcloud

Resource server 2: PermaplanT

Client 1: Nextcloud WebClient [with oidc login](https://github.com/pulsejet/nextcloud-oidc-login) or [user\_oidc](https://github.com/nextcloud/user_oidc)

Client 2: PermaplanT

**Notes:**
In this approach the accounts are managed by PermaplanT,
therefore requires implementing an identity provider in PermaplanT.
Alternatively to developing an identity provider a servive like [keycloak](https://www.keycloak.org/) can be used.

## Further Notes
There was an attempt to implement OIDC in nextcloud/server but the issue lost traction and was finally not merged because of missing integration tests (https://github.com/nextcloud/server/pull/12567)
