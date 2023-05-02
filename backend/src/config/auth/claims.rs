use actix_web::http::StatusCode;
use jsonwebtoken::{decode, decode_header, DecodingKey, Validation};
use serde::Deserialize;

use crate::error::ServiceError;

use super::jwks::Jwks;

#[derive(Debug, Clone, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub scope: String,
}

impl Claims {
    pub async fn validate(token: &str) -> Result<Self, ServiceError> {
        let header = decode_header(token).unwrap();
        let kid = header.kid.as_ref().unwrap();

        let jwk = Jwks::get().await.find(kid).ok_or(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "no valid key found".to_owned(),
        ))?;

        let claims = decode(
            token,
            &DecodingKey::from_jwk(&jwk).unwrap(),
            &Validation::new(header.alg),
        )
        .map_err(|_| ServiceError::new(StatusCode::UNAUTHORIZED, "invalid token".to_owned()))?
        .claims;
        Ok(claims)
    }
}
