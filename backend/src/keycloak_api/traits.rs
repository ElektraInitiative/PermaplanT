//! Traits for the Keycloak API.

use async_trait::async_trait;

use crate::model::dto::{PageParameters, UserSearchParameters};

use super::{errors::KeycloakApiError, UserDto};

/// Helper type for results.
pub type Result<T> = std::result::Result<T, KeycloakApiError>;

#[async_trait]
pub trait KeycloakApi {
    /// Search for users by their username.
    ///
    /// # Errors
    /// - If the url cannot be parsed.
    /// - If the authorization header cannot be created.
    /// - If the request fails or the response cannot be deserialized.
    async fn search_users_by_username(
        &self,
        search_params: &UserSearchParameters,
        pagination: &PageParameters,
        client: &reqwest::Client,
    ) -> Result<Vec<UserDto>>;

    /// Gets all users given their ids from the Keycloak API.
    ///
    /// # Errors
    /// - If the url cannot be parsed.
    /// - If the authorization header cannot be created.
    /// - If the request fails or the response cannot be deserialized.
    async fn get_users_by_ids(
        &self,
        client: &reqwest::Client,
        user_ids: Vec<uuid::Uuid>,
    ) -> Result<Vec<UserDto>>;

    /// Gets a user by its id from the Keycloak API.
    ///
    /// # Errors
    /// - If the url cannot be parsed.
    /// - If the authorization header cannot be created.
    /// - If the request fails or the response cannot be deserialized.
    async fn get_user_by_id(
        &self,
        client: &reqwest::Client,
        user_id: uuid::Uuid,
    ) -> Result<UserDto>;
}
