//! Handles authentication and authorization.

use std::time::Duration;

use actix_web::dev::ServiceRequest;
use actix_web::http::StatusCode;
use actix_web_grants::permissions::AttachPermissions;
use actix_web_httpauth::extractors::bearer::BearerAuth;
use jwtk::jwk::RemoteJwksVerifier;
use serde::Deserialize;

use crate::error::ServiceError;

/// The URL where Keycloak's public keys for JWT verification can be found.
const JKWS_URL: &str = "http://localhost:8081/realms/PermaplanT/protocol/openid-connect/certs";

/// Additional fields in the JWT
#[derive(Debug, Clone, Deserialize)]
struct Claims {
    /// Scopes are basically roles/permissions
    scope: String,
}

/// Validates JWTs in request.
///
/// Used by [`actix_web_httpauth::middleware::HttpAuthentication`].
///
/// # Errors
/// * If the token is missing or invalid
#[allow(clippy::future_not_send)] // function signature is required by [`actix_web_httpauth`]
pub async fn validator(
    req: ServiceRequest,
    credentials: BearerAuth,
) -> Result<ServiceRequest, (actix_web::Error, ServiceRequest)> {
    let verifier = RemoteJwksVerifier::new(JKWS_URL.to_owned(), None, Duration::from_secs(10));
    let claims = verifier.verify::<Claims>(credentials.token()).await;
    let claims = match claims {
        Ok(claims) => claims,
        Err(err) => {
            return Err((
                ServiceError::new(StatusCode::UNAUTHORIZED, err.to_string()).into(),
                req,
            ))
        }
    };

    let scopes = claims
        .claims()
        .extra
        .scope
        .split(' ')
        .map(str::to_owned)
        .collect();
    req.attach(scopes);
    Ok(req)
}
