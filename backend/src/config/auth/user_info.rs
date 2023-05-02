use actix_http::HttpMessage;
use actix_utils::future::{ready, Ready};
use actix_web::FromRequest;
use serde::Deserialize;

use crate::error::ServiceError;

use super::claims::Claims;

#[derive(Debug, Clone, Deserialize)]
pub struct UserInfo {
    pub id: String,
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
        let user_info = extensions.get::<UserInfo>().unwrap().clone();
        ready(Ok(user_info))
    }
}
