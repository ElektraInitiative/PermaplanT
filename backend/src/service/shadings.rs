//! Service layer for shadings.

use actix_http::StatusCode;
use actix_web::web::Data;
use chrono::Days;

use crate::config::data::AppDataInner;
use crate::error::ServiceError;
use crate::model::dto::core::TimelinePage;
use crate::model::dto::shadings::{
    DeleteShadingDto, NewShadingDto, ShadingDto, ShadingSearchParameters, UpdateShadingDto,
};
use crate::model::entity::shadings::Shading;
use crate::model::entity::shadings_impl::FindShadingsParameters;

/// Time offset in days for loading shadings in the timeline.
pub const TIME_LINE_LOADING_OFFSET_DAYS: u64 = 356;

/// Search shadings from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: ShadingSearchParameters,
    app_data: &Data<AppDataInner>,
) -> Result<TimelinePage<ShadingDto>, ServiceError> {
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

    let search_parameters = FindShadingsParameters {
        layer_id: search_parameters.layer_id,
        from,
        to,
    };
    let result = Shading::find(search_parameters, &mut conn).await?;

    Ok(TimelinePage {
        results: result,
        from,
        to,
    })
}

/// Create a new shading in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn create(
    dto: Vec<NewShadingDto>,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<ShadingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Shading::create(dto, &mut conn).await?;
    Ok(result)
}

/// Update the shading in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn update(
    dto: UpdateShadingDto,
    app_data: &Data<AppDataInner>,
) -> Result<Vec<ShadingDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Shading::update(dto, &mut conn).await?;
    Ok(result)
}

/// Delete the shading from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn delete_by_ids(
    dtos: Vec<DeleteShadingDto>,
    app_data: &Data<AppDataInner>,
) -> Result<(), ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let _ = Shading::delete_by_ids(dtos, &mut conn).await?;
    Ok(())
}
