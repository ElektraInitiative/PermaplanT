use crate::{config::db::Pool, model::response::Body, service};
use actix_web::{
    get,
    web::{self, Data},
    HttpResponse, Result,
};

#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::map::find_all(&pool)).await??;
    Ok(HttpResponse::Ok().json(Body::from(response)))
}

#[get("/{id}")]
pub async fn find_by_id(id: web::Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::map::find_by_id(id.into_inner(), &pool)).await??;
    Ok(HttpResponse::Ok().json(Body::from(response)))
}
