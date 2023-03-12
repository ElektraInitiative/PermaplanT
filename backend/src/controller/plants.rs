//! `Plants` endpoints.

use crate::{config::db::Pool, model::response::Body, service};
use actix_web::{
    get,
    web::{self, Data},
    HttpResponse, Result,
};

/// Endpoint for fetching all [`PlantsDto`](crate::model::dto::PlantsDto).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[utoipa::path(
    context_path = "/api/plants",
    responses(
        (status = 200, description = "Fetch all plants", body = BodyVecPlants)
    )
)]
#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::plants::find_all(&pool)).await??;
    Ok(HttpResponse::Ok().json(Body::from(response)))
}
