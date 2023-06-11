//! Service layer for seeds.

use actix_web::web::Data;

use crate::config::data::AppDataInner;
use crate::error::ServiceError;
use crate::model::dto::Page;
use crate::model::dto::{
    plantings::{NewPlantingDto, PlantingDto, PlantingSearchParameters, UpdatePlantingDto},
    PageParameters,
};
use crate::model::entity::plantings::Planting;

/// Search seeds from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: PlantingSearchParameters,
    page_parameters: PageParameters,
    app_data: &Data<AppDataInner>,
) -> Result<Page<PlantingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::find(search_parameters, page_parameters, &mut conn).await?;
    Ok(result)
}

/// Find the seed by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(
    id: i32,
    app_data: &Data<AppDataInner>,
) -> Result<PlantingDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Create a new seed in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    new_seed: NewPlantingDto,
    app_data: &Data<AppDataInner>,
) -> Result<PlantingDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::create(new_seed, &mut conn).await?;
    Ok(result)
}

/// Delete the seed from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    id: i32,
    new_seed: UpdatePlantingDto,
    app_data: &Data<AppDataInner>,
) -> Result<PlantingDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::update(id, new_seed, &mut conn).await?;
    Ok(result)
}

/// Delete the seed from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: i32, app_data: &Data<AppDataInner>) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = Planting::delete_by_id(id, &mut conn).await?;
    Ok(())
}
