use actix_web::{
    web::{Data, Json},
    HttpResponse, Result,
};

use crate::{
    config::db::Pool,
    constants,
    models::{response::ResponseBody, seed::NewSeed},
    services,
};

pub async fn create_seed(new_seed_json: Json<NewSeed>, pool: Data<Pool>) -> Result<HttpResponse> {
    match services::seed_service::create(new_seed_json.0, &pool) {
        Ok(()) => Ok(HttpResponse::Created()
            .json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY))),
        Err(err) => Ok(err.response()),
    }
}
