use actix_web::{http::StatusCode, web::Data};

use crate::{
    config::db::Pool,
    error::ServiceError,
    models::{
        dto::{new_seed_dto::NewSeedDTO, seed_dto::SeedDTO},
        seed::Seed,
    },
};

pub fn find_all(pool: &Data<Pool>) -> Result<Vec<SeedDTO>, ServiceError> {
    let mut conn = pool.get().expect("Failed to retrieve pool.");
    match Seed::find_all(&mut conn) {
        Ok(seeds) => Ok(seeds),
        Err(msg) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            msg.to_string(),
        )),
    }
}

pub fn create(new_seed: NewSeedDTO, pool: &Data<Pool>) -> Result<(), ServiceError> {
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
