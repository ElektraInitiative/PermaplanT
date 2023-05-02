//! Handles authentication and authorization.

mod jwt_claims;
pub mod user_info_extractor;

use actix_http::HttpMessage;
use actix_web::dev::ServiceRequest;
use actix_web_grants::permissions::AttachPermissions;
use actix_web_httpauth::extractors::bearer::BearerAuth;

use self::user_info_extractor::UserInfo;

/// Validates JWTs in request and sets user information as part of the request.
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
    let claims = jwt_claims::Claims::validate(credentials.token())
        .await
        .unwrap();
    let user_info = UserInfo::from(claims);

    req.extensions_mut().insert(user_info.clone());
    req.attach(user_info.roles);

    Ok(req)
}
