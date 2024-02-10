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
    /// The scopes the current user has.
    pub scopes: Vec<String>,
    /// The roles the current user has.
    pub roles: Vec<Role>,
}

/// Roles a user can have
#[derive(Debug, Clone, Deserialize)]
pub enum Role {
    /// The user is a member.
    Member,
}

impl UserInfo {
    /// Checks if the user is a member.
    #[must_use]
    pub fn is_member(&self) -> bool {
        self.roles.iter().any(|role| matches!(role, Role::Member))
    }
}

impl Role {
    /// Convert a role from a string.
    #[must_use]
    pub fn from_string(str: &str) -> Option<Self> {
        match str {
            "member" => Some(Self::Member),
            _ => None,
        }
    }
}

// Trait implementations

impl From<Claims> for UserInfo {
    fn from(value: Claims) -> Self {
        Self {
            id: value.sub,
            scopes: value.scope.split(' ').map(str::to_owned).collect(),
            roles: value
                .realm_access
                .roles
                .into_iter()
                .filter_map(|s| Role::from_string(&s))
                .collect::<Vec<_>>(),
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
