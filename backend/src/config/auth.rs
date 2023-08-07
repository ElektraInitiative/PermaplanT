//! Handles authentication and authorization.

mod claims;
pub mod jwks;
pub mod middleware;
pub mod user_info;
pub mod user_token;

use jsonwebtoken::jwk::JwkSet;
use log::trace;
use serde::Deserialize;
use tokio::sync::OnceCell;

use self::jwks::fetch_keys;

/// Stores the servers [`Config`].
static CONFIG: OnceCell<Config> = OnceCell::const_new();

/// Contains information about the auth server.
#[derive(Debug, Clone)]
pub struct Config {
    /// Metadata relevant for Oauth2
    pub openid_configuration: OpenIDEndpointConfiguration,
    /// The `client_id` the frontend should use to login its users.
    pub client_id: String,
    /// The [`JwkSet`] that can be used to validate tokens
    pub jwk_set: JwkSet,
}

impl Config {
    /// Set the [`Config`].
    ///
    /// Needed for tests as static variables are shared by tests.
    /// Error is ignored on purpose as this function will be called multiple times.
    #[cfg(test)]
    pub fn set(config: Self) {
        let _ = CONFIG.set(config);
    }

    /// Initialize the server authorization and authentication.
    ///
    /// # Panics
    /// * If it was already initialized.
    /// * If the auth server is unreachable or is set up incorrectly.
    #[allow(clippy::expect_used)]
    pub async fn init(app_config: &crate::config::app::Config) {
        trace!("Initializing auth...");
        let openid_config =
            OpenIDEndpointConfiguration::fetch(&app_config.auth_discovery_uri).await;

        let config = Self {
            client_id: app_config.client_id.clone(),
            jwk_set: fetch_keys(&openid_config.jwks_uri).await,
            openid_configuration: openid_config,
        };

        CONFIG.set(config).expect("Already initialized!");
    }

    /// Get the [`Config`].
    ///
    /// # Panics
    /// * If it wasn't initialized.
    #[allow(clippy::expect_used)]
    pub fn get() -> &'static Self {
        CONFIG.get().expect("Not yet initialized!")
    }
}

/// Metadata provided by the auth server.
///
/// See [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414.html#section-2) for more detail.
#[derive(Debug, Clone, Default, Deserialize)]
pub struct OpenIDEndpointConfiguration {
    /// The base URL of the authorization server
    pub issuer: String,
    /// URL of the authorization server's authorization endpoint
    pub authorization_endpoint: String,
    /// URL of the authorization server's token endpoint
    pub token_endpoint: String,
    /// URL of the authorization server's JWK Set
    pub jwks_uri: String,
}

impl OpenIDEndpointConfiguration {
    /// Fetch relevant URL endpoints from the auth server.
    ///
    /// # Panics
    /// * If the auth server is set up incorrectly. This would always lead to irrecoverable errors.
    #[allow(clippy::expect_used)]
    async fn fetch(issuer_uri: &str) -> Self {
        trace!("Fetching endpoints from discovery endpoint...");
        reqwest::get(issuer_uri)
            .await
            .expect("Error fetching from auth server!")
            .json::<Self>()
            .await
            .expect("Auth server returned invalid keys!")
    }
}
