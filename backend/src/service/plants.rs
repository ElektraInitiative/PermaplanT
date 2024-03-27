//! Service layer for plants.

use crate::{
    config::data::SharedPool,
    error::ServiceError,
    model::{
        dto::{Page, PageParameters, PlantsSearchParameters, PlantsSummaryDto},
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
    pool: &SharedPool,
) -> Result<Page<PlantsSummaryDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = match &search_parameters.name {
        // Empty search queries should be treated like nonexistent queries.
        Some(query) if !query.is_empty() => {
            Plants::search(query, page_parameters, &mut conn).await?
        }
        _ => Plants::find_any(page_parameters, &mut conn).await?,
    };

    Ok(result)
}

/// Find the plant by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &SharedPool) -> Result<PlantsSummaryDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Plants::find_by_id(id, &mut conn).await?;
    Ok(result)
}
