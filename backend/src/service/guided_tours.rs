//! Service layer for guided tours.

use uuid::Uuid;

use crate::{
    config::data::SharedPool,
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
pub async fn setup(user_id: Uuid, pool: &SharedPool) -> Result<GuidedToursDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = GuidedTours::setup(user_id, &mut conn).await?;
    Ok(result)
}

/// Get the Guided Tour status for a user.
/// A new Guided Tour status will be created if none for this user exist.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_user(
    user_id: Uuid,
    pool: &SharedPool,
) -> Result<GuidedToursDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = GuidedTours::find_by_user(user_id, &mut conn).await;
    match result {
        Ok(result) => Ok(result),
        Err(diesel::result::Error::NotFound) => Ok(GuidedTours::setup(user_id, &mut conn).await?),
        Err(e) => Err(e.into()),
    }
}

/// Update the Guided Tour status for a user.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    status_update: UpdateGuidedToursDto,
    user_id: Uuid,
    pool: &SharedPool,
) -> Result<GuidedToursDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = GuidedTours::update(status_update, user_id, &mut conn).await?;
    Ok(result)
}
