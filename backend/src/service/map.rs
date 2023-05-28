//! Service layer for maps.

use actix_web::web::Data;

use crate::model::dto::{MapSearchParameters, Page};
use crate::model::dto::{
    MapVersionDto, MapVersionSearchParameters, NewMapVersionDto, PageParameters,
};
use crate::model::entity::MapVersion;
use crate::{
    db::connection::Pool,
    error::ServiceError,
    model::{
        dto::{MapDto, NewMapDto},
        entity::Map,
    },
    AppDataInner,
};

/// Search maps from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: MapSearchParameters,
    page_parameters: PageParameters,
    app_data: &Data<AppDataInner>,
) -> Result<Page<MapDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Map::find(search_parameters, page_parameters, &mut conn).await?;
    Ok(result)
}

/// Find a map by id in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, app_data: &Data<AppDataInner>) -> Result<MapDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Map::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new map in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    new_map: NewMapDto,
    app_data: &Data<AppDataInner>,
) -> Result<MapDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Map::create(new_map, &mut conn).await?;
    Ok(result)
}

/// Show all versions of a map.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn show_versions(
    search_parameters: MapVersionSearchParameters,
    page_parameters: PageParameters,
    app_data: &Data<AppDataInner>,
) -> Result<Page<MapVersionDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = MapVersion::find(search_parameters, page_parameters, &mut conn).await?;
    Ok(result)
}

/// Save a snapshot of the map as a new version.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn save_snapshot(
    new_map_version: NewMapVersionDto,
    app_data: &Data<AppDataInner>,
) -> Result<MapVersionDto, ServiceError> {
    // TODO: create element entries for all layers with reference to this version - see issue #341.
    let mut conn = app_data.pool.get().await?;
    let result = MapVersion::create(new_map_version, &mut conn).await?;
    Ok(result)
}
