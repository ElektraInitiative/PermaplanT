//! Service layer for user data.

use actix_web::web::Data;
use uuid::Uuid;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{
        dto::{GuidedToursDto, UserDataDto},
        entity::UserData,
    },
};

/// Fetch status of Guided Tours from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn guided_tours(
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<GuidedToursDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = UserData::guided_tours(user_id, &mut conn).await?;
    Ok(result)
}

/// Create an user data entry for a new user.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    user_id: Uuid,
    user_data: UserDataDto,
    app_data: &Data<AppDataInner>,
) -> Result<UserDataDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = UserData::create(user_data, user_id, &mut conn).await?;
    Ok(result)
}
