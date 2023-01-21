use actix_web::{http::StatusCode, web::Data};

use crate::{
    config::db::Pool,
    constants,
    error::ServiceError,
    models::seed::{NewSeed, Seed},
};

pub fn create(new_seed: NewSeed, pool: &Data<Pool>) -> Result<(), ServiceError> {
    match Seed::create(&mut pool.get().unwrap(), new_seed) {
        Ok(_) => Ok(()),
        Err(_) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            constants::MESSAGE_CAN_NOT_INSERT_DATA.to_string(),
        )),
    }
}
