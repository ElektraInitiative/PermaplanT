//! Service layer for map.

use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    model::{dto::MapDto, entity::Map},
};

/// Fetch all maps from the database.
///
/// # Errors
/// If the connection to the database could not be established.
pub fn find_all(pool: &Data<Pool>) -> Result<Vec<MapDto>, ServiceError> {
    let mut conn = pool.get()?;
    let result = Map::find_all(&mut conn)?;
    Ok(result)
}
