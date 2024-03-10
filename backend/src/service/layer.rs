//! Service layer for layers.

use actix_web::web::Data;

use crate::config::data::AppDataInner;
use crate::{
    error::ServiceError,
    model::{
        dto::{LayerDto, NewLayerDto},
        entity::Layer,
    },
};
use lib_db::model::dto::LayerSearchParameters;

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
    new_layer: NewLayerDto,
    app_data: &Data<AppDataInner>,
) -> Result<LayerDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Layer::create(new_layer, &mut conn).await?;
    Ok(result)
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
