//! Service layer for layers.

use crate::{
    config::data::SharedPool,
    error::ServiceError,
    model::{
        dto::{LayerDto, LayerSearchParameters, NewLayerDto},
        entity::Layer,
    },
};

/// Search layers from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: LayerSearchParameters,
    pool: &SharedPool,
) -> Result<Vec<LayerDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Layer::find(search_parameters, &mut conn).await?;
    Ok(result)
}

/// Find a layer by id in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &SharedPool) -> Result<LayerDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Layer::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new layer in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(new_layer: NewLayerDto, pool: &SharedPool) -> Result<LayerDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Layer::create(new_layer, &mut conn).await?;
    Ok(result)
}

/// Delete the layer in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: i32, pool: &SharedPool) -> Result<(), ServiceError> {
    let mut conn = pool.get().await?;
    let _ = Layer::delete_by_id(id, &mut conn).await?;
    Ok(())
}
