//! Service layer for plants.

use actix_web::web::Data;
use uuid::Uuid;

use super::util::HalfMonthBucket;
use crate::config::data::AppDataInner;
use crate::model::dto::Page;
use crate::model::dto::PageParameters;
use crate::model::dto::PlantSuggestionsSearchParameters;
use crate::model::dto::RelationDto;
use crate::model::dto::RelationSearchParameters;
use crate::{
    error::ServiceError,
    model::{
        dto::{PlantsSearchParameters, PlantsSummaryDto},
        entity::Plants,
    },
};

/// Search plants from in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find(
    search_parameters: PlantsSearchParameters,
    page_parameters: PageParameters,
    app_data: &Data<AppDataInner>,
) -> Result<Page<PlantsSummaryDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = match &search_parameters.name {
        // Empty search queries should be treated like nonexistent queries.
        Some(query) if !query.is_empty() => {
            Plants::search(query, page_parameters, &mut conn).await?
        }
        _ => Plants::find_any(page_parameters, &mut conn).await?,
    };

    Ok(result)
}

/// Get all relations of a certain plant.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_relations(
    search_query: RelationSearchParameters,
    app_data: &Data<AppDataInner>,
) -> Result<RelationDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Plants::find_relations(search_query, &mut conn).await?;
    Ok(result)
}

/// Find the plant by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(
    id: i32,
    app_data: &Data<AppDataInner>,
) -> Result<PlantsSummaryDto, ServiceError> {
    let mut conn = app_data.pool.get().await?;
    let result = Plants::find_by_id(id, &mut conn).await?;
    Ok(result)
}

/// Find plants that are available and seasonal.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_available_seasonal(
    search_parameters: PlantSuggestionsSearchParameters,
    page_parameters: PageParameters,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<Page<PlantsSummaryDto>, ServiceError> {
    let mut conn = app_data.pool.get().await?;

    let half_month_bucket = search_parameters.relative_to_date.half_month_bucket();

    let result =
        Plants::find_available_seasonal(half_month_bucket, user_id, page_parameters, &mut conn)
            .await?;

    Ok(result)
}
