//! Manages the [`JwkSet`] the server uses to validate tokens.

use jsonwebtoken::jwk::{Jwk, JwkSet};
use serde::Deserialize;

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
#[allow(clippy::expect_used)]
pub async fn fetch_keys(url: &str) -> JwkSet {
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
