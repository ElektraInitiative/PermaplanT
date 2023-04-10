//! Service layer for plants.

use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    model::{
        dto::{PlantsSearchParameters, PlantsSummaryDto},
        entity::Plants,
    },
};

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
) -> Result<Vec<PlantsSummaryDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Plants::search(query, &mut conn).await?;
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
