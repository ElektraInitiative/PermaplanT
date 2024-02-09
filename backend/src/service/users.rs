//! Service layer for user data.

use actix_web::web::Data;
use reqwest::StatusCode;
use uuid::Uuid;

use crate::keycloak_api::dtos::UserDto;
use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{dto::UsersDto, entity::Users},
};

/// Create a user data entry for a new user.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    user_id: Uuid,
    user_data: UsersDto,
    app_data: &Data<AppDataInner>,
) -> Result<UsersDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Users::create(user_data, user_id, &mut conn).await?;
    Ok(result)
}

/// Get all users.
pub async fn find(app_data: &Data<AppDataInner>) -> Result<Vec<UserDto>, ServiceError> {
    let users = app_data
        .keycloak_api
        .get_users(&app_data.http_client)
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

/// Get a user by its id.
pub async fn find_by_id(
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<UserDto, ServiceError> {
    let user = app_data
        .keycloak_api
        .get_user_by_id(&app_data.http_client, user_id)
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
