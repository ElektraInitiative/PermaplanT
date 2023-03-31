//! `Plants` endpoints.

use crate::{config::db::Pool, model::dto::QueryParameters, service};
use actix_web::{
    get,
    web::{self, Data, Path},
    HttpResponse, Result,
};

/// Endpoint for fetching all [`PlantsSummaryDto`](crate::model::dto::PlantsSummaryDto).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[utoipa::path(
    context_path = "/api/plants",
    responses(
        (status = 200, description = "Fetch all plants", body = Vec<PlantsSummaryDto>)
    )
)]
#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::plants::find_all(&pool)).await??;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for searching [`PlantsSummaryDto`](crate::model::dto::PlantsSummaryDto) by their common name or
/// species name.
/// Search parameters are taken from the URLs query string (e.g. .../api/plants/search?query=example&limit=5).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[utoipa::path(
    context_path = "/api/plants/search",
    responses(
        (status = 200, description = "Search for plants by their common or speices name", body = Vec<PlantsSummaryDto>)
    )
)]
#[get("/search")]
pub async fn search(query: web::Query<QueryParameters>, pool: Data<Pool>) -> Result<HttpResponse> {
    let query = query.into_inner();
    let response = web::block(move || service::plants::search(&pool, &query)).await??;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for fetching a [`Plant`](crate::model::entity::Plants).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[utoipa::path(
    context_path = "/api/plants/{id}",
    responses(
        (status = 200, description = "Fetch plant by id", body = PlantsSummaryDto)
    )
)]
#[get("/{id}")]
pub async fn find_by_id(id: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::plants::find_by_id(*id, &pool)).await??;
    Ok(HttpResponse::Ok().json(response))
}
