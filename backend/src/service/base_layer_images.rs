//! Service layer for images on the base layer.

use uuid::Uuid;

use crate::{
    config::data::SharedPool,
    error::ServiceError,
    model::{
        dto::{BaseLayerImageDto, UpdateBaseLayerImageDto},
        entity::BaseLayerImages,
    },
};

/// Fetch all base layer images for the layer from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    pool: &SharedPool,
    layer_id: i32,
) -> Result<Vec<BaseLayerImageDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = BaseLayerImages::find(&mut conn, layer_id).await?;
    Ok(result)
}

/// Create a base layer image in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    dto: BaseLayerImageDto,
    pool: &SharedPool,
) -> Result<BaseLayerImageDto, ServiceError> {
    let mut conn = pool.get().await?;
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
    pool: &SharedPool,
) -> Result<BaseLayerImageDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = BaseLayerImages::update(id, dto, &mut conn).await?;
    Ok(result)
}

/// Delete the base layer image from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: Uuid, pool: &SharedPool) -> Result<(), ServiceError> {
    let mut conn = pool.get().await?;
    let _ = BaseLayerImages::delete_by_id(id, &mut conn).await?;
    Ok(())
}
