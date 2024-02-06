//! Responsible for parsing and validating JWT tokens.

use actix_web::http::StatusCode;
use jsonwebtoken::{decode, decode_header, DecodingKey, Validation};
use serde::Deserialize;
use uuid::Uuid;

use crate::error::ServiceError;

use super::Config;

/// Fields the token has (only the necessary fields are actually extracted).
#[derive(Debug, Clone, Deserialize)]
pub struct Claims {
    /// The subject
    pub sub: Uuid,
    /// The OAuth2 scope
    pub scope: String,
    /// Realm roles
    pub realm_access: RealmAccess,
}

#[derive(Debug, Clone, Deserialize)]
/// The roles active at the realm level.
pub struct RealmAccess {
    /// The roles active at the realm level.
    pub roles: Vec<String>,
}

impl Claims {
    /// Validate the provided token and parses it.
    ///
    /// # Errors
    /// * If the token is invalid.
    pub fn validate(token: &str) -> Result<Self, ServiceError> {
        let header = decode_header(token)
            .map_err(|_| ServiceError::new(StatusCode::UNAUTHORIZED, "invalid token".to_owned()))?;
        let kid = header.kid.as_ref().ok_or_else(|| {
            ServiceError::new(StatusCode::UNAUTHORIZED, "missing kid in token".to_owned())
        })?;

        let jwk = Config::get().jwk_set.find(kid).ok_or_else(|| {
            ServiceError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "no valid key found".to_owned(),
            )
        })?;

        let decoding_key = &DecodingKey::from_jwk(jwk)
            .map_err(|err| ServiceError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

        let claims = decode(token, decoding_key, &Validation::new(header.alg))
            .map_err(|_| ServiceError::new(StatusCode::UNAUTHORIZED, "invalid token".to_owned()))?
            .claims;
        Ok(claims)
    }
}

#[cfg(test)]
mod test {
    use crate::test::util::{jwks::init_auth, token::generate_token};

    use super::Claims;

    #[test]
    fn test_simple_token_succeeds() {
        let jwk = init_auth();
        let token = generate_token(jwk, 300);
        assert!(Claims::validate(&token).is_ok())
    }

    #[test]
    fn test_expired_token_fails() {
        let jwk = init_auth();
        let token = generate_token(jwk, -300);
        assert!(Claims::validate(&token).is_err())
    }

    #[test]
    fn test_invalid_token_fails() {
        let _ = init_auth();
        assert!(Claims::validate("not a token").is_err())
    }
}
