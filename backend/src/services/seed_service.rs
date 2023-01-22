use actix_web::{http::StatusCode, web::Data};

use crate::{
    config::db::Pool,
    error::ServiceError,
    models::seed::{NewSeed, Seed},
};

pub fn create(new_seed: NewSeed, pool: &Data<Pool>) -> Result<(), ServiceError> {
    let mut conn = pool.get().expect("Failed to retrieve pool.");
    match Seed::create(new_seed, &mut conn) {
        Ok(_) => Ok(()),
        Err(msg) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            msg.to_string(),
        )),
    }
}

pub fn delete_by_id(id: i32, pool: &Data<Pool>) -> Result<(), ServiceError> {
    let mut conn = pool.get().expect("Failed to retrieve pool.");
    match Seed::delete_by_id(id, &mut conn) {
        Ok(_) => Ok(()),
        Err(msg) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            msg.to_string(),
        )),
    }
}
