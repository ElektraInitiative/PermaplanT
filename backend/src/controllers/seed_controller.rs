use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
    HttpResponse, Result,
};

use crate::{
    config::db::Pool,
    constants,
    models::{dto::new_seed_dto::NewSeedDTO, response::ResponseBody},
    services,
};

#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || services::seed_service::find_all(&pool)).await??;
    Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, response)))
}

#[post("")]
pub async fn create(new_seed_json: Json<NewSeedDTO>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response =
        web::block(move || services::seed_service::create(new_seed_json.0, &pool)).await??;
    Ok(HttpResponse::Created().json(ResponseBody::new(constants::MESSAGE_OK, response)))
}

#[delete("/{id}")]
pub async fn delete_by_id(path: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    web::block(move || services::seed_service::delete_by_id(*path, &pool)).await??;
    Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY)))
}
