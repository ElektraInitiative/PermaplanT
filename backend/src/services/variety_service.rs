use actix_web::{http::StatusCode, web::Data};

use crate::{config::db::Pool, error::ServiceError, models::variety::Varietie};

pub fn find_all(pool: &Data<Pool>) -> Result<Vec<Varietie>, ServiceError> {
    let mut conn = pool.get().expect("Failed to retrieve pool.");
    match Varietie::find_all(&mut conn) {
        Ok(varieties) => Ok(varieties),
        Err(msg) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            msg.to_string(),
        )),
    }
}
