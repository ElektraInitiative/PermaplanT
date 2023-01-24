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
    match services::seed_service::find_all(&pool) {
        Ok(seeds) => Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, seeds))),
        Err(err) => Ok(err.response()),
    }
}

pub async fn create(new_seed_json: Json<NewSeedDTO>, pool: Data<Pool>) -> Result<HttpResponse> {
    match services::seed_service::create(new_seed_json.0, &pool) {
        Ok(seed) => {
            Ok(HttpResponse::Created().json(ResponseBody::new(constants::MESSAGE_OK, seed)))
        }
        Err(err) => Ok(err.response()),
    }
}

pub async fn delete_by_id(path: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    match services::seed_service::delete_by_id(*path, &pool) {
        Ok(_) => {
            Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY)))
        }
        Err(err) => Ok(err.response()),
    }
}