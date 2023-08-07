//! Contains [`UserToken`] which stores the current user token.

use actix_http::{HttpMessage, StatusCode};
use actix_utils::future::{ready, Ready};
use actix_web::FromRequest;
use actix_web_httpauth::extractors::bearer::BearerAuth;
use serde::Deserialize;

use crate::error::ServiceError;

/// User token.
#[derive(Debug, Clone, Deserialize)]
pub struct UserToken {
    /// The current users token.
    pub token: String,
}

impl From<&BearerAuth> for UserToken {
    fn from(value: &BearerAuth) -> Self {
        Self {
            token: value.token().to_string(),
        }
    }
}

impl FromRequest for UserToken {
    type Future = Ready<Result<Self, Self::Error>>;
    type Error = ServiceError;

    fn from_request(
        req: &actix_web::HttpRequest,
        _payload: &mut actix_http::Payload,
    ) -> Self::Future {
        let extensions = req.extensions();
        ready({
            extensions.get::<Self>().map_or_else(
                || {
                    Err(ServiceError::new(
                        StatusCode::INTERNAL_SERVER_ERROR,
                        StatusCode::INTERNAL_SERVER_ERROR.to_string(),
                    ))
                },
                |user_token| Ok(user_token.clone()),
            )
        })
    }
}
