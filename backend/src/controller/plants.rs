//! `Plants` endpoints.

use crate::{config::db::Pool, service};
use actix_web::{
    get,
    web::{Data, Path},
    HttpResponse, Result,
};

/// Endpoint for fetching all [`PlantsDto`](crate::model::dto::PlantsDto).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plants",
    responses(
        (status = 200, description = "Fetch all plants", body = Vec<PlantsDto>)
    )
)]
#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = service::plants::find_all(&pool).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for fetching a [`Plant`](crate::model::entity::Plants).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plants/{id}",
    responses(
        (status = 200, description = "Fetch plant by id", body = PlantsDto)
    )
)]
#[get("/{id}")]
pub async fn find_by_id(id: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = service::plants::find_by_id(*id, &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}
