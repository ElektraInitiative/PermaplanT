use jsonwebtoken::jwk::{Jwk, JwkSet};
use serde::Deserialize;
use tokio::sync::OnceCell;

static JWKS: OnceCell<JwkSet> = OnceCell::const_new();

pub struct Jwks;

impl Jwks {
    pub fn init(keys: JwkSet) {
        JWKS.set(keys).unwrap();
    }
    pub async fn init_from_remote(url: &str) {
        let keys = fetch_keys(url).await;
        Self::init(keys);
    }
    pub fn get() -> &'static JwkSet {
        JWKS.get().unwrap()
    }
}

#[derive(Debug, Clone, Deserialize)]
struct JwkSetHelper {
    keys: Vec<serde_json::Value>,
}

async fn fetch_keys(url: &str) -> JwkSet {
    let keys = reqwest::get(url)
        .await
        .unwrap()
        // [`JwkSet`] doesn't work directly as Keycloak uses algorithms jsonwebtoken doesn't support. This mean deserialization would fail.
        .json::<JwkSetHelper>()
        .await
        .unwrap()
        .keys
        .into_iter()
        .filter_map(|key| serde_json::from_value::<Jwk>(key).ok())
        .collect::<Vec<_>>();

    JwkSet { keys }
}
