use actix_web::{
    web::{Data, Json, Path},
    HttpResponse, Result,
};

use crate::{
    config::db::Pool,
    constants,
    models::{dto::new_seed_dto::NewSeedDTO, response::ResponseBody},
    services,
};

pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = services::seed_service::find_all(&pool)?;
    Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, response)))
}

pub async fn create(new_seed_json: Json<NewSeedDTO>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = services::seed_service::create(new_seed_json.0, &pool)?;
    Ok(HttpResponse::Created().json(ResponseBody::new(constants::MESSAGE_OK, response)))
}

pub async fn delete_by_id(path: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    services::seed_service::delete_by_id(*path, &pool)?;
    Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY)))
}
