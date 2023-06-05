//! Service layer for layers.

use actix_web::web::Data;

use crate::model::dto::PageParameters;
use crate::model::dto::{LayerSearchParameters, Page};
use crate::{
    db::connection::Pool,
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
    page_parameters: PageParameters,
    pool: &Data<Pool>,
) -> Result<Page<LayerDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Layer::find(search_parameters, page_parameters, &mut conn).await?;
    Ok(result)
}

/// Find a layer by id in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &Data<Pool>) -> Result<LayerDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Layer::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new layer in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(new_layer: NewLayerDto, pool: &Data<Pool>) -> Result<LayerDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Layer::create(new_layer, &mut conn).await?;
    Ok(result)
}
