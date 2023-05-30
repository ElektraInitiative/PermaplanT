use std::time::{SystemTime, UNIX_EPOCH};

use jsonwebkey::JsonWebKey;
use serde::Serialize;
use uuid::Uuid;

/// Generate a token using the jwk (see [`super::init_jwks::init_jwks`]) and an offset.
///
/// The offset is added to the current time (meaning -300 would be expired, 300 is valid)
pub fn generate_token(jwk: JsonWebKey, exp_offset: i64) -> String {
    let mut header = jsonwebtoken::Header::new(jwk.algorithm.unwrap().into());
    header.kid = Some(jwk.key_id.clone().unwrap());

    jsonwebtoken::encode(
        &header,
        &TokenClaims::with_exp_offset(exp_offset),
        &jwk.key.to_encoding_key(),
    )
    .unwrap()
}

#[derive(Debug, Clone, Serialize)]
struct TokenClaims {
    exp: u64,
    sub: Uuid,
    scope: String,
}

impl TokenClaims {
    fn with_exp_offset(exp_offset: i64) -> Self {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards!")
            .as_secs();
        let exp = now.checked_add_signed(exp_offset).unwrap();
        Self {
            exp,
            sub: Uuid::new_v4(),
            scope: String::new(),
        }
    }
}
