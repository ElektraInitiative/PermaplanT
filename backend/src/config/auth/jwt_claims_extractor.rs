use actix_web::http::{header, StatusCode};
use jsonwebtoken::{decode, decode_header, jwk::JwkSet, DecodingKey, Validation};
use serde::Deserialize;

use crate::error::ServiceError;

/// The URL where Keycloak's public keys for JWT verification can be found.
const JKWS_URL: &str = "http://localhost:8081/realms/PermaplanT/protocol/openid-connect/certs";

#[derive(Debug, Clone, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub scope: String,
}

impl Claims {
    pub async fn from_request(token: &str) -> Result<Self, ServiceError> {
        // TODO: use extensions or middleware. Otherwise this function gets called twice
        // TODO: cannot deserialize as Keycloak uses RSA-OAEP Alogrithm which jsonwebtoken doesn't know
        let jwks = reqwest::get(JKWS_URL)
            .await
            .unwrap()
            .json::<JwkSet>()
            .await
            .unwrap();

        let header = decode_header(token).unwrap();
        let jwk = jwks.find(&header.kid.unwrap()).unwrap();
        println!("{jwks:?}");
        println!("{jwk:?}");

        let claims = decode(
            token,
            &DecodingKey::from_jwk(jwk).unwrap(),
            &Validation::new(header.alg),
        )
        .unwrap()
        .claims;
        Ok(claims)
    }
}

pub fn get_token_from_request(req: &actix_web::HttpRequest) -> Result<String, ServiceError> {
    let auth_header = req
        .headers()
        .get(header::AUTHORIZATION)
        .ok_or(ServiceError::new(
            StatusCode::UNAUTHORIZED,
            "missing token".to_owned(),
        ))?;
    auth_header
        .to_str()
        .map_err(|err| ServiceError::new(StatusCode::UNAUTHORIZED, err.to_string()))?
        .strip_prefix("Bearer ")
        .ok_or(ServiceError::new(
            StatusCode::UNAUTHORIZED,
            "invalid format".to_owned(),
        ))
        .map(str::to_owned)
}
