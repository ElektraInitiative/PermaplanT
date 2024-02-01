use jsonwebkey::JsonWebKey;
use jsonwebtoken::jwk::JwkSet;

use crate::config::auth::{Config, OpenIDEndpointConfiguration};

/// Pre generated jwk
const JWK: &'static str = include_str!("test_jwk.json");

/// Load key from pre generated one. Init [`Jwks`] using it.
pub fn init_auth() -> JsonWebKey {
    // Both crates are necessary as jsonwebtoken cannot generate an encoding key from a jwk.
    let jwk1 = serde_json::from_str::<jsonwebtoken::jwk::Jwk>(JWK).unwrap();
    let jwk2 = serde_json::from_str::<jsonwebkey::JsonWebKey>(JWK).unwrap();

    // Init application auth settings
    Config::set(Config {
        openid_configuration: OpenIDEndpointConfiguration::default(),
        client_id: "PermaplanT".to_owned(),
        jwk_set: JwkSet { keys: vec![jwk1] },
    });

    jwk2
}
