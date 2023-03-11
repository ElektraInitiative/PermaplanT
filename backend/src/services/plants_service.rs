//! Service layer for plants.

use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    models::{dto::plants::PlantsDTO, plants::Plants},
};

/// Fetch all plants from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub fn find_all(pool: &Data<Pool>) -> Result<Vec<PlantsDTO>, ServiceError> {
    let mut conn = pool.get()?;
    let result = Plants::find_all(&mut conn)?;
    Ok(result)
}
