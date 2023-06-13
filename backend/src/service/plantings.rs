//! Service layer for plantings.

use actix_web::web::Data;
use uuid::Uuid;

use crate::config::data::AppDataInner;
use crate::error::ServiceError;
use crate::model::dto::plantings::{
    NewPlantingDto, PlantingDto, PlantingSearchParameters, UpdatePlantingDto,
};
use crate::model::entity::plantings::Planting;

/// Search plantings from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: PlantingSearchParameters,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<PlantingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::find(search_parameters, &mut conn).await?;
    Ok(result)
}

/// Create a new planting in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    dto: NewPlantingDto,
    app_data: &Data<AppDataInner>,
) -> Result<PlantingDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::create(dto, &mut conn).await?;
    Ok(result)
}

/// Update the planting in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    id: Uuid,
    dto: UpdatePlantingDto,
    app_data: &Data<AppDataInner>,
) -> Result<PlantingDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::update(id, dto, &mut conn).await?;
    Ok(result)
}

/// Delete the planting from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_id(id: Uuid, app_data: &Data<AppDataInner>) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = Planting::delete_by_id(id, &mut conn).await?;
    Ok(())
}
