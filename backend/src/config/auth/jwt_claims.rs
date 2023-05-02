use actix_web::http::{header, StatusCode};
use jsonwebtoken::{decode, decode_header, jwk::Jwk, DecodingKey, Validation};
use serde::Deserialize;

use crate::error::ServiceError;

/// The URL where Keycloak's public keys for JWT verification can be found.
const JKWS_URL: &str = "http://localhost:8081/realms/PermaplanT/protocol/openid-connect/certs";

#[derive(Debug, Clone, Deserialize)]
struct JwkSetHelper {
    keys: Vec<serde_json::Value>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub scope: String,
}

impl Claims {
    pub async fn validate(token: &str) -> Result<Self, ServiceError> {
        let header = decode_header(token).unwrap();

        // TODO: use extensions or middleware. Otherwise this function gets called twice
        // [`JwkSet`] doesn't work as Keycloak uses algorithms jsonwebtoken doesn't support. This mean deserialization would fail.
        let jwk = reqwest::get(JKWS_URL)
            .await
            .unwrap()
            .json::<JwkSetHelper>()
            .await
            .unwrap()
            .keys
            .into_iter()
            .filter_map(|key| serde_json::from_value::<Jwk>(key).ok())
            .find(|a| a.common.key_id.as_ref().unwrap() == header.kid.as_ref().unwrap())
            .unwrap();

        println!("{jwk:?}");

        let claims = decode(
            token,
            &DecodingKey::from_jwk(&jwk).unwrap(),
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
