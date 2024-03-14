//! Service layer for plantings.

use actix_web::web::Data;
use uuid::Uuid;

use crate::config::data::AppDataInner;
use crate::error::ServiceError;
use crate::model::dto::drawings::DrawingDto;
use crate::model::entity::drawings::Drawing;

/// Get all drawings from one map.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    map_id: i32,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<DrawingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let results = Drawing::find(map_id, &mut conn).await?;
    Ok(results)
}

/// Save new drawing.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    dtos: Vec<DrawingDto>,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<DrawingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Drawing::create(dtos, &mut conn).await?;
    Ok(result)
}

/// Update the planting in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    dto: Vec<DrawingDto>,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<DrawingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Drawing::update(dto, &mut conn).await?;
    Ok(result)
}

/// Delete drawings from the databse.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_ids(
    ids: Vec<Uuid>,
    app_data: &Data<AppDataInner>,
) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = Drawing::delete_by_ids(ids, &mut conn).await?;
    Ok(())
}
