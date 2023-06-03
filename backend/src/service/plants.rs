//! Service layer for plants.

use actix_web::web::Data;

use crate::model::dto::Page;
use crate::model::dto::PageParameters;
use crate::{
    db::connection::Pool,
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
    pool: &Data<Pool>,
) -> Result<Page<PlantsSummaryDto>, ServiceError> {
    // Empty search queries should be treated like nonexistent queries.
    let mut search_query: Option<String> = search_parameters.name;
    if search_query == Some(String::new()) {
        search_query = None;
    }

    let mut conn = pool.get().await?;
    let result = match search_query {
        Some(query) => Plants::search(&query, page_parameters, &mut conn).await?,
        None => Plants::find_any(page_parameters, &mut conn).await?,
    };
    Ok(result)
}

/// Find the plant by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &Data<Pool>) -> Result<PlantsSummaryDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Plants::find_by_id(id, &mut conn).await?;
    Ok(result)
}
