//! Service layer for plantings.

use actix_http::StatusCode;
use actix_web::web::Data;
use chrono::Days;
use uuid::Uuid;

use crate::config::data::AppDataInner;
use crate::error::ServiceError;
use crate::model::dto::core::TimelinePage;
use crate::model::dto::plantings::{
    DeletePlantingDto, NewPlantingDto, PlantingDto, PlantingSearchParameters, UpdatePlantingDto,
};
use crate::model::entity::plantings::Planting;
use crate::model::entity::plantings_impl::FindPlantingsParameters;

/// Time offset in days for loading plantings in the timeline.
pub const TIME_LINE_LOADING_OFFSET_DAYS: u64 = 356;

/// Search plantings from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: PlantingSearchParameters,
    app_data: &Data<AppDataInner>,
) -> Result<TimelinePage<PlantingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;

    let from = search_parameters
        .relative_to_date
        .checked_sub_days(Days::new(TIME_LINE_LOADING_OFFSET_DAYS))
        .ok_or_else(|| {
            ServiceError::new(
                StatusCode::BAD_REQUEST,
                "Could not add days to relative_to_date".into(),
            )
        })?;

    let to = search_parameters
        .relative_to_date
        .checked_add_days(Days::new(TIME_LINE_LOADING_OFFSET_DAYS))
        .ok_or_else(|| {
            ServiceError::new(
                StatusCode::BAD_REQUEST,
                "Could not add days to relative_to_date".into(),
            )
        })?;

    let search_parameters = FindPlantingsParameters {
        layer_id: search_parameters.layer_id,
        plant_id: search_parameters.plant_id,
        from,
        to,
    };
    let result = Planting::find(search_parameters, &mut conn).await?;

    Ok(TimelinePage {
        results: result,
        from,
        to,
    })
}

/// Get all plantings that have a specific seed id.
/// Also returns a plantings map id.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_seed_id(
    seed_id: i32,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<PlantingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::find_by_seed_id(seed_id, &mut conn).await?;
    Ok(result)
}

/// Create a new planting in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    dtos: Vec<NewPlantingDto>,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<PlantingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::create(dtos, user_id, &mut conn).await?;
    Ok(result)
}

/// Update the planting in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    dto: UpdatePlantingDto,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<PlantingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Planting::update(dto, &mut conn).await?;
    Ok(result)
}

/// Delete the planting from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_ids(
    dtos: Vec<DeletePlantingDto>,
    app_data: &Data<AppDataInner>,
) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = Planting::delete_by_ids(dtos, &mut conn).await?;
    Ok(())
}
