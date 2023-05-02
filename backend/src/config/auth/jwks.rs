//! Manages the [`JwkSet`] the server uses to validate tokens.

// If any function in this module would fail it would always lead to irrecoverable errors.
#![allow(clippy::expect_used)]

use jsonwebtoken::jwk::{Jwk, JwkSet};
use serde::Deserialize;
use tokio::sync::OnceCell;

/// Stores the servers [`JwkSet`].
static JWKS: OnceCell<JwkSet> = OnceCell::const_new();

/// Helper struct to manage global [`JWKS`].
pub struct Jwks;

impl Jwks {
    /// Set the [`JwkSet`].
    ///
    /// # Panics
    /// * If it was already initialized.
    #[cfg(not(test))]
    pub fn init(keys: JwkSet) {
        JWKS.set(keys).expect("Already initialized!");
    }

    /// Set the [`JwkSet`].
    ///
    /// Needed for tests as static variables are shared by tests.
    /// Error is ignored on purpose as this function will be called multiple times.
    #[cfg(test)]
    pub fn init(keys: JwkSet) {
        let _ = JWKS.set(keys);
    }

    /// Fetches the [`JwkSet`] from a remote url.
    ///
    /// # Panics
    /// * If it was already initialized.
    pub async fn init_from_remote(url: &str) {
        let keys = fetch_keys(url).await;
        Self::init(keys);
    }

    /// Get the [`JwkSet`].
    ///
    /// # Panics
    /// * If it wasn't initialized.
    pub fn get() -> &'static JwkSet {
        JWKS.get().expect("Not yet initialized!")
    }
}

/// In between struct for [`JwkSet`].
///
/// [`JwkSet`] doesn't work directly as `Keycloak` uses algorithms [`jsonwebtoken`] doesn't support. This mean deserialization would fail.
#[derive(Debug, Clone, Deserialize)]
struct JwkSetHelper {
    /// The keys returned from the server.
    ///
    /// Keys that cannot be deserialized to [`Jwk`] will be ignored.
    keys: Vec<serde_json::Value>,
}

/// Fetch jwks from the provided url and tries to parse them to [`JwkSet`].
///
/// # Panics
/// * If the request to the auth server fails.
/// * If the keys cannot be deserialized to [`JwkSetHelper`].
async fn fetch_keys(url: &str) -> JwkSet {
    let keys = reqwest::get(url)
        .await
        .expect("Error fetching from auth server!")
        .json::<JwkSetHelper>()
        .await
        .expect("Auth server returned invalid keys!")
        .keys
        .into_iter()
        .filter_map(|key| serde_json::from_value::<Jwk>(key).ok())
        .collect::<Vec<_>>();

    JwkSet { keys }
}
