//! Contains [`UserInfo`] which stores information about the current user.

use actix_http::{HttpMessage, StatusCode};
use actix_utils::future::{ready, Ready};
use actix_web::FromRequest;
use serde::Deserialize;
use uuid::Uuid;

use crate::error::ServiceError;

use super::claims::Claims;

/// Information about the user extracted from the token provided.
#[derive(Debug, Clone, Deserialize)]
pub struct UserInfo {
    /// The current users id.
    pub id: Uuid,
    /// The roles the current user has.
    pub roles: Vec<String>,
}

impl From<Claims> for UserInfo {
    fn from(value: Claims) -> Self {
        Self {
            id: value.sub,
            roles: value.scope.split(' ').map(str::to_owned).collect(),
        }
    }
}

impl FromRequest for UserInfo {
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
                |user_info| Ok(user_info.clone()),
            )
        })
    }
}
