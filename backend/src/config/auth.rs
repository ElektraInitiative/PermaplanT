//! Handles authentication and authorization.

mod jwt_claims_extractor;
pub mod user_info_extractor;

use actix_web::dev::ServiceRequest;
use actix_web_grants::permissions::AttachPermissions;
use actix_web_httpauth::extractors::bearer::BearerAuth;

use self::user_info_extractor::UserInfo;

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
    let claims = jwt_claims_extractor::Claims::from_request(credentials.token())
        .await
        .unwrap();
    req.attach(UserInfo::from(claims).scope);
    Ok(req)
}
