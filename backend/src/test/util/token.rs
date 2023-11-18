use std::time::{SystemTime, UNIX_EPOCH};

use jsonwebkey::JsonWebKey;
use serde::Serialize;
use uuid::Uuid;

/// Generate a token using the jwk (see [`super::init_jwks::init_jwks`]) and an offset.
///
/// The offset is added to the current time (meaning -300 would be expired, 300 is valid)
#[must_use]
pub fn generate_token(jwk: JsonWebKey, exp_offset: i64) -> String {
    let mut header = jsonwebtoken::Header::new(jwk.algorithm.unwrap().into());
    header.kid = Some(jwk.key_id.clone().unwrap());

    jsonwebtoken::encode(
        &header,
        &TokenClaims::new().with_exp_offset(exp_offset),
        &jwk.key.to_encoding_key(),
    )
    .unwrap()
}

#[must_use]
pub fn generate_token_for_user(jwk: JsonWebKey, exp_offset: i64, user_id: Uuid) -> String {
    let mut header = jsonwebtoken::Header::new(jwk.algorithm.unwrap().into());
    header.kid = Some(jwk.key_id.clone().unwrap());

    jsonwebtoken::encode(
        &header,
        &TokenClaims::new()
            .with_exp_offset(exp_offset)
            .with_sub(user_id),
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
    fn new() -> Self {
        Self {
            exp: 0,
            sub: Uuid::new_v4(),
            scope: String::new(),
        }
    }

    fn with_exp_offset(self, exp_offset: i64) -> Self {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards!")
            .as_secs();
        let exp = now.checked_add_signed(exp_offset).unwrap();
        Self { exp, ..self }
    }

    fn with_sub(self, sub: Uuid) -> Self {
        Self { sub, ..self }
    }
}
