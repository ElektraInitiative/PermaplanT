//! Service layer for plants.

use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    model::{dto::PlantsDto, entity::Plants},
};

/// Fetch all plants from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_all(pool: &Data<Pool>) -> Result<Vec<PlantsDto>, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Plants::find_all(&mut conn).await?;
    Ok(result)
}

/// Find the plant by id from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub async fn find_by_id(id: i32, pool: &Data<Pool>) -> Result<PlantsDto, ServiceError> {
    let mut conn = pool.get().await?;
    let result = Plants::find_by_id(id, &mut conn).await?;
    Ok(result)
}
