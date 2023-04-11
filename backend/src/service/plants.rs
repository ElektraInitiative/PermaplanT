//! Service layer for plants.

use actix_web::web::Data;

use crate::{
    db::connection::Pool,
    error::ServiceError,
    model::{
        dto::{PlantsSearchDto, PlantsSearchParameters, PlantsSummaryDto},
        entity::Plants,
    },
};

use std::cmp;

/// Fetch all plants from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_all(pool: &Data<Pool>) -> Result<Vec<PlantsSummaryDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Plants::find_all(&mut conn).await?;
    Ok(result)
}

/// Search plants from in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn search(
    pool: &Data<Pool>,
    query: &PlantsSearchParameters,
) -> Result<PlantsSearchDto, ServiceError> {
    let mut conn = pool.get().await?;

    let pages_start_at_1 = 1;
    let calculated_offset = query.limit * (query.page - pages_start_at_1);
    // disallows negative offsets
    let offset = cmp::max(calculated_offset, 0);

    let result = Plants::search(&query.search_term, query.limit, offset, &mut conn).await?;
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
