use crate::{config::db::Pool, constants, models::response::ResponseBody, services};
use actix_web::{web::Data, HttpResponse, Result};

pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = services::variety_service::find_all(&pool)?;
    Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, response)))
}
