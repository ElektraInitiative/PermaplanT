use actix_web::{http::StatusCode, web::Data};

use crate::{config::db::Pool, error::ServiceError, models::variety::Variety};

pub fn find_all(pool: &Data<Pool>) -> Result<Vec<Variety>, ServiceError> {
    let mut conn = pool.get().expect("Failed to retrieve pool.");
    match Variety::find_all(&mut conn) {
        Ok(varieties) => Ok(varieties),
        Err(msg) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            msg.to_string(),
        )),
    }
}
