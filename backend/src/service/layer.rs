//! Service layer for layers.

use actix_web::web::Data;

use crate::config::data::AppDataInner;
use crate::model::dto::layers::LayerRenameDto;
use crate::model::dto::LayerSearchParameters;
use crate::{
    error::ServiceError,
    model::{
        dto::{LayerDto, NewLayerDto},
        entity::Layer,
    },
};

/// Search layers from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: LayerSearchParameters,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<LayerDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Layer::find(search_parameters, &mut conn).await?;
    Ok(result)
}

/// Find a layer by id in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, app_data: &Data<AppDataInner>) -> Result<LayerDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Layer::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new layer in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    map_id: i32,
    new_layer: NewLayerDto,
    app_data: &Data<AppDataInner>,
) -> Result<LayerDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Layer::create(map_id, new_layer, &mut conn).await?;
    Ok(result)
}

pub async fn reorder(
    map_id: i32,
    order: Vec<i32>,
    app_data: &Data<AppDataInner>,
) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    Layer::reorder(map_id, order, &mut conn).await?;
    Ok(())
}

pub async fn rename(
    map_id: i32,
    dto: LayerRenameDto,
    app_data: &Data<AppDataInner>,
) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    Layer::rename(map_id, dto, &mut conn).await?;
    Ok(())
}

/// Delete the layer in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: i32, app_data: &Data<AppDataInner>) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = Layer::delete_by_id(id, &mut conn).await?;
    Ok(())
}
