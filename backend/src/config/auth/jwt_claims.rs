use actix_web::http::{header, StatusCode};
use jsonwebtoken::{
    decode, decode_header,
    jwk::{Jwk, JwkSet},
    DecodingKey, Validation,
};
use serde::Deserialize;

use crate::error::ServiceError;

#[derive(Debug, Clone, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub scope: String,
}

impl Claims {
    pub async fn validate(token: &str) -> Result<Self, ServiceError> {
        let header = decode_header(token).unwrap();
        let kid = header.kid.as_ref().unwrap();

        // TODO: use extensions or middleware. Otherwise this function gets called twice
        // [`JwkSet`] doesn't work as Keycloak uses algorithms jsonwebtoken doesn't support. This mean deserialization would fail.
        let jwks = fetch_keys().await?;

        let jwk = jwks.find(kid).ok_or(ServiceError::new(
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

async fn fetch_keys() -> Result<JwkSet, ServiceError> {
    #[derive(Debug, Clone, Deserialize)]
    struct JwkSetHelper {
        keys: Vec<serde_json::Value>,
    }

    /// The URL where Keycloak's public keys for JWT verification can be found.
    const JKWS_URL: &str = "http://localhost:8081/realms/PermaplanT/protocol/openid-connect/certs";

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
    let jwks = JwkSet { keys };
    Ok(jwks)
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
