//! `Variety` endpoints.

use crate::{config::db::Pool, constants, model::response::Body, service};
use actix_web::{
    get,
    web::{self, Data},
    HttpResponse, Result,
};

/// Endpoint for fetching all [VarietyDTOs](crate::models::dto::variety_dto::VarietyDTO).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::plants::find_all(&pool)).await??;
    Ok(HttpResponse::Ok().json(Body::new(constants::MESSAGE_OK, response)))
}
