use actix_service::boxed::BoxFuture;
use actix_web::FromRequest;
use serde::Deserialize;

use crate::error::ServiceError;

use super::jwt_claims::{get_token_from_request, Claims};

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
    type Future = BoxFuture<Result<Self, Self::Error>>;
    type Error = ServiceError;

    fn from_request(
        req: &actix_web::HttpRequest,
        _payload: &mut actix_http::Payload,
    ) -> Self::Future {
        let token = get_token_from_request(req).unwrap();
        Box::pin(async move { Claims::validate(&token).await.map(UserInfo::from) })
    }
}
