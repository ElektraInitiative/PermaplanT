//! Handles authentication and authorization.

// If any function in this module would fail it would always lead to irrecoverable errors.
#![allow(clippy::expect_used)]

mod claims;
pub mod jwks;
pub mod user_info;

use actix_http::HttpMessage;
use actix_web::dev::ServiceRequest;
use actix_web_grants::permissions::AttachPermissions;
use actix_web_httpauth::extractors::bearer::BearerAuth;

use jsonwebtoken::jwk::JwkSet;
use serde::Deserialize;
use tokio::sync::OnceCell;

use self::{jwks::fetch_keys, user_info::UserInfo};

/// Stores the servers [`AuthConfig`].
static AUTH_CONFIG: OnceCell<AuthConfig> = OnceCell::const_new();

#[derive(Debug, Clone)]
pub struct AuthConfig {
    pub openid_configuration: OpenidConfiguration,
    pub jwk_set: JwkSet,
}

impl AuthConfig {
    #[cfg(test)]
    pub fn set(config: Self) {
        let _ = AUTH_CONFIG.set(config);
    }

    pub async fn init(issuer_uri: &str) {
        let config = OpenidConfiguration::fetch(issuer_uri).await;

        let config = AuthConfig {
            jwk_set: fetch_keys(&config.jwks_uri).await,
            openid_configuration: config,
        };
        let _ = AUTH_CONFIG.set(config);
    }

    pub fn get() -> &'static Self {
        AUTH_CONFIG.get().expect("Not yet initialized!")
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct OpenidConfiguration {
    pub authorization_endpoint: String,
    pub token_endpoint: String,
    pub jwks_uri: String,
}

impl OpenidConfiguration {
    async fn fetch(issuer_uri: &str) -> Self {
        reqwest::get(issuer_uri)
            .await
            .expect("Error fetching from auth server!")
            .json::<Self>()
            .await
            .expect("Auth server returned invalid keys!")
    }
}

/// Validates JWTs in requests and sets user information as part of the request.
///
/// Used by [`actix_web_httpauth::middleware::HttpAuthentication`].
///
/// # Errors
/// * If the token is missing or invalid
pub fn validator(
    req: ServiceRequest,
    credentials: &BearerAuth,
) -> Result<ServiceRequest, (actix_web::Error, ServiceRequest)> {
    let user_info = match claims::Claims::validate(credentials.token()) {
        Ok(claims) => UserInfo::from(claims),
        Err(err) => return Err((err.into(), req)),
    };

    req.extensions_mut().insert(user_info.clone());
    req.attach(user_info.roles);

    Ok(req)
}
