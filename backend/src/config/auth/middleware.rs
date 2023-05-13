//! Set up [`actix_web`] to authenticate request in the middleware and insert [`UserInfo`] into the following [`ServiceRequest`].

use actix_http::HttpMessage;
use actix_web::dev::ServiceRequest;
use actix_web_grants::permissions::AttachPermissions;
use actix_web_httpauth::extractors::bearer::BearerAuth;

use super::{claims::Claims, user_info::UserInfo};

/// Validates JWTs in requests and sets user information as part of the request.
///
/// Used by [`actix_web_httpauth::middleware::HttpAuthentication`].
///
/// # Errors
/// * If the token is missing or invalid
pub fn validator(
    req: ServiceRequest,
    credentials: &BearerAuth,
) -> Result<ServiceRequest, (actix_web::Error, ServiceRequest)> {
    let user_info = match Claims::validate(credentials.token()) {
        Ok(claims) => UserInfo::from(claims),
        Err(err) => return Err((err.into(), req)),
    };

    req.extensions_mut().insert(user_info.clone());
    req.attach(user_info.roles);

    Ok(req)
}
