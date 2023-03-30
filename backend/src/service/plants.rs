//! Service layer for plants.

use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    model::{
        dto::{PlantsSearchDto, QueryParameters},
        entity::Plants,
    },
};

/// Fetch all plants from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub fn find_all(pool: &Data<Pool>) -> Result<Vec<PlantsSearchDto>, ServiceError> {
    let mut conn = pool.get()?;
    let result = Plants::find_all(&mut conn)?;
    Ok(result)
}

/// Search plants from in the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub fn search(pool: &Data<Pool>, query: &QueryParameters) -> Result<Vec<PlantsSearchDto>, ServiceError> {
    let mut conn = pool.get()?;
    let result = Plants::search(query, &mut conn)?;
    Ok(result)
}
