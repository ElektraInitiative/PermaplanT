//! Service layer for plantings.

use actix_http::StatusCode;
use chrono::Days;

use crate::{
    config::data::SharedPool,
    error::ServiceError,
    model::{
        dto::{
            core::TimelinePage,
            plantings::{
                DeletePlantingDto, NewPlantingDto, PlantingDto, PlantingSearchParameters,
                UpdatePlantingDto,
            },
        },
        entity::{plantings::Planting, plantings_impl::FindPlantingsParameters},
    },
};

/// Time offset in days for loading plantings in the timeline.
pub const TIME_LINE_LOADING_OFFSET_DAYS: u64 = 356;

/// Search plantings from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: PlantingSearchParameters,
    pool: &SharedPool,
) -> Result<TimelinePage<PlantingDto>, ServiceError> {
    let mut conn = pool.get().await?;

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
    pool: &SharedPool,
) -> Result<Vec<PlantingDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Planting::find_by_seed_id(seed_id, &mut conn).await?;
    Ok(result)
}

/// Create a new planting in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    dtos: Vec<NewPlantingDto>,
    pool: &SharedPool,
) -> Result<Vec<PlantingDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Planting::create(dtos, &mut conn).await?;
    Ok(result)
}

/// Update the planting in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    dto: UpdatePlantingDto,
    pool: &SharedPool,
) -> Result<Vec<PlantingDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Planting::update(dto, &mut conn).await?;
    Ok(result)
}

/// Delete the planting from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_ids(
    dtos: Vec<DeletePlantingDto>,
    pool: &SharedPool,
) -> Result<(), ServiceError> {
    let mut conn = pool.get().await?;
    let _ = Planting::delete_by_ids(dtos, &mut conn).await?;
    Ok(())
}
