//! Service layer for images on the base layer.

use actix_web::web::Data;
use uuid::Uuid;

use crate::config::data::AppDataInner;
use crate::error::ServiceError;
use lib_db::model::dto::{BaseLayerImageDto, UpdateBaseLayerImageDto};
use lib_db::model::entity::BaseLayerImages;

/// Fetch all base layer images for the layer from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    app_data: &Data<AppDataInner>,
    layer_id: i32,
) -> Result<Vec<BaseLayerImageDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = BaseLayerImages::find(&mut conn, layer_id).await?;
    Ok(result)
}

/// Create a base layer image in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    dto: BaseLayerImageDto,
    app_data: &Data<AppDataInner>,
) -> Result<BaseLayerImageDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = BaseLayerImages::create(dto, &mut conn).await?;
    Ok(result)
}

/// Update the base layer image in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    id: Uuid,
    dto: UpdateBaseLayerImageDto,
    app_data: &Data<AppDataInner>,
) -> Result<BaseLayerImageDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = BaseLayerImages::update(id, dto, &mut conn).await?;
    Ok(result)
}

/// Delete the base layer image from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: Uuid, app_data: &Data<AppDataInner>) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = BaseLayerImages::delete_by_id(id, &mut conn).await?;
    Ok(())
}
