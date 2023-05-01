//! Service layer for base layers (map component)

use actix_web::web::Data;

use crate::{
    db::connection::Pool,
    model::dto::{BaseLayerDto, NewBaseLayerDto},
    error::ServiceError,
};

use crate::model::entity::BaseLayer;

/// Find a base layer by its id in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &Data<Pool>) -> Result<BaseLayerDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = BaseLayer::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new base layer in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(new_base_layer: NewBaseLayerDto, pool: &Data<Pool>) -> Result<BaseLayerDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = BaseLayer::create(new_base_layer, &mut conn).await?;
    Ok(result)
}

/// Find a base layer by its id in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: i32, pool: &Data<Pool>) -> Result<usize, ServiceError> {
    let mut conn = pool.get().await?;
    let result = BaseLayer::delete_by_id(id, &mut conn).await?;
    Ok(result)
}