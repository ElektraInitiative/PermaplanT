//! Service layer for guided tours.

use actix_web::web::Data;
use uuid::Uuid;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{
        dto::{GuidedToursDto, UpdateGuidedToursDto},
        entity::GuidedTours,
    },
};

/// Setup the Guided Tour status for a new user.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn setup(
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<GuidedToursDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = GuidedTours::setup(user_id, &mut conn).await?;
    Ok(result)
}

/// Get the Guided Tour status for a user.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_user(
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<GuidedToursDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = GuidedTours::find_by_user(user_id, &mut conn).await?;
    Ok(result)
}

/// Update the Guided Tour status for a user.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    status_update: UpdateGuidedToursDto,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<GuidedToursDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = GuidedTours::update(status_update, user_id, &mut conn).await?;
    Ok(result)
}
