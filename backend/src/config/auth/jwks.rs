use actix_http::StatusCode;
use jsonwebtoken::jwk::{Jwk, JwkSet};
use serde::Deserialize;
use tokio::sync::OnceCell;

use crate::error::ServiceError;

static JWKS: OnceCell<JwkSet> = OnceCell::const_new();

pub struct Jwks;

impl Jwks {
    pub async fn get() -> &'static JwkSet {
        JWKS.get_or_try_init(fetch_keys).await.unwrap()
    }
}

#[derive(Debug, Clone, Deserialize)]
struct JwkSetHelper {
    keys: Vec<serde_json::Value>,
}

async fn fetch_keys() -> Result<JwkSet, ServiceError> {
    /// The URL where Keycloak's public keys for JWT verification can be found.
    const JKWS_URL: &str = "http://localhost:8081/realms/PermaplanT/protocol/openid-connect/certs";

    // [`JwkSet`] doesn't work as Keycloak uses algorithms jsonwebtoken doesn't support. This mean deserialization would fail.
    let keys = reqwest::get(JKWS_URL)
        .await
        .map_err(|_| {
            ServiceError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "unable to fetch keys".to_owned(),
            )
        })?
        .json::<JwkSetHelper>()
        .await
        .map_err(|_| {
            ServiceError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "invalid response".to_owned(),
            )
        })?
        .keys
        .into_iter()
        .filter_map(|key| serde_json::from_value::<Jwk>(key).ok())
        .collect::<Vec<_>>();

    Ok(JwkSet { keys })
}
