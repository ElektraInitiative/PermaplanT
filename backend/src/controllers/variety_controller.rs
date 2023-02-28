use crate::{config::db::Pool, constants, models::response::ResponseBody, services};
use actix_web::{
    get,
    web::{self, Data},
    HttpResponse, Result,
};

#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || services::variety_service::find_all(&pool)).await??;
    Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, response)))
}
