//! Service layer for user data.

use reqwest::StatusCode;
use uuid::Uuid;

use crate::{
    config::data::{SharedHttpClient, SharedKeycloakApi, SharedPool},
    error::ServiceError,
    keycloak_api::dtos::UserDto,
    model::{dto::UsersDto, entity::Users},
};

/// Create a user data entry for a new user.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    user_id: Uuid,
    user_data: UsersDto,
    pool: &SharedPool,
) -> Result<UsersDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Users::create(user_data, user_id, &mut conn).await?;
    Ok(result)
}

/// Get all users.
pub async fn find(
    keycloak_api: &SharedKeycloakApi,
    http_client: &SharedHttpClient,
) -> Result<Vec<UserDto>, ServiceError> {
    let users = keycloak_api.get_users(&http_client).await.map_err(|e| {
        log::error!("Error getting user data from Keycloak API: {e}");
        ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Error getting user data from Keycloak API".to_owned(),
        )
    })?;

    Ok(users)
}

/// Get a user by its id.
pub async fn find_by_id(
    user_id: Uuid,
    keycloak_api: &SharedKeycloakApi,
    http_client: &SharedHttpClient,
) -> Result<UserDto, ServiceError> {
    let user = keycloak_api
        .get_user_by_id(&http_client, user_id)
        .await
        .map_err(|e| {
            log::error!("Error getting user data from Keycloak API: {e}");
            ServiceError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error getting user data from Keycloak API".to_owned(),
            )
        })?;

    Ok(user)
}

/// Get users by their ids.
pub async fn find_by_ids(
    user_ids: Vec<Uuid>,
    keycloak_api: &SharedKeycloakApi,
    http_client: &SharedHttpClient,
) -> Result<Vec<UserDto>, ServiceError> {
    let users = keycloak_api
        .get_users_by_ids(&http_client, user_ids)
        .await
        .map_err(|e| {
            log::error!("Error getting user data from Keycloak API: {e}");
            ServiceError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error getting user data from Keycloak API".to_owned(),
            )
        })?;

    Ok(users)
}
