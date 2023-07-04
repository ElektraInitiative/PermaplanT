//! Service layer for plantings.

use actix_web::web::Data;
use uuid::Uuid;

use crate::config::data::AppDataInner;
use crate::error::ServiceError;
use crate::model::dto::{BaseLayerImagesDto, UpdateBaseLayerImagesDto};
use crate::model::entity::BaseLayerImages;

/// Search plantings from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(app_data: &Data<AppDataInner>) -> Result<Vec<BaseLayerImagesDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = BaseLayerImages::find(&mut conn).await?;
    Ok(result)
}

/// Create a new planting in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    dto: BaseLayerImagesDto,
    app_data: &Data<AppDataInner>,
) -> Result<BaseLayerImagesDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = BaseLayerImages::create(dto, &mut conn).await?;
    Ok(result)
}

/// Update the planting in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    id: Uuid,
    dto: UpdateBaseLayerImagesDto,
    app_data: &Data<AppDataInner>,
) -> Result<BaseLayerImagesDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = BaseLayerImages::update(id, dto, &mut conn).await?;
    Ok(result)
}

/// Delete the planting from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: Uuid, app_data: &Data<AppDataInner>) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = BaseLayerImages::delete_by_id(id, &mut conn).await?;
    Ok(())
}
