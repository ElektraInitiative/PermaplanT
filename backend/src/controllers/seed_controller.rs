use actix_web::{web::Data, HttpResponse, Responder};

use crate::{config::db::Pool, services};

pub async fn create_seed(req_body: String, pool: Data<Pool>) -> impl Responder {
    services::seed_service::create(&pool);
    HttpResponse::Ok().body(req_body)
}
