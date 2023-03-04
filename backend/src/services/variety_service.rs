use actix_web::web::Data;

use crate::{
    config::db::Pool,
    error::ServiceError,
    models::{dto::variety_dto::VarietyDTO, variety::Variety},
};

/// Fetch all plants from the database.
/// 
/// # Errors
/// If the connection to the database could not be established.
pub fn find_all(pool: &Data<Pool>) -> Result<Vec<VarietyDTO>, ServiceError> {
    let mut conn = pool.get()?;
    let result = Variety::find_all(&mut conn)?;
    Ok(result)
}
