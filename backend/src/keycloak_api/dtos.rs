//! Dto types for keycloak admin API.

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

/// Dto for a user.
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UserDto {
    /// The user's ID.
    pub id: Uuid,
    /// The user's username.
    pub username: String,
}
