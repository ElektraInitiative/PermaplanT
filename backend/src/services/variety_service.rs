use actix_web::{http::StatusCode, web::Data};

use crate::{
    config::db::Pool,
    error::ServiceError,
    models::{dto::variety_dto::VarietyDTO, variety::Variety},
};

pub fn find_all(pool: &Data<Pool>) -> Result<Vec<VarietyDTO>, ServiceError> {
    let mut conn = pool.get()?;

    match Variety::find_all(&mut conn) {
        Ok(varieties) => Ok(varieties),
        Err(msg) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            msg.to_string(),
        )),
    }
}
