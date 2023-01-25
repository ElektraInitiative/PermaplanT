use crate::{config::db::Pool, constants, models::response::ResponseBody, services};
use actix_web::{web::Data, HttpResponse, Result};

pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    match services::variety_service::find_all(&pool) {
        Ok(varieties) => {
            Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, varieties)))
        }
        Err(err) => Ok(err.response()),
    }
}
