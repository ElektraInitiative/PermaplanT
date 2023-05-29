//! Service layer for maps.

use actix_web::web::Data;

use crate::model::dto::PageParameters;
use crate::model::dto::{MapSearchParameters, Page};
use crate::{
    db::connection::Pool,
    error::ServiceError,
    model::{
        dto::{MapDto, NewMapDto},
        entity::Map,
    },
};

/// Search maps from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: MapSearchParameters,
    page_parameters: PageParameters,
    pool: &Data<Pool>,
) -> Result<Page<MapDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Map::find(search_parameters, page_parameters, &mut conn).await?;
    Ok(result)
}

/// Find a map by id in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &Data<Pool>) -> Result<MapDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Map::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new map in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(new_map: NewMapDto, pool: &Data<Pool>) -> Result<MapDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Map::create(new_map, &mut conn).await?;
    Ok(result)
}
