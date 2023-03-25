//! `Plants` endpoints.

use crate::{config::db::Pool, service};
use actix_web::{
    get,
    web::{self, Data},
    HttpResponse, Result,
};
use serde::Deserialize;

/// Endpoint for fetching all [`PlantsDto`](crate::model::dto::PlantsDto).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[utoipa::path(
    context_path = "/api/plants",
    responses(
        (status = 200, description = "Fetch all plants", body = Vec<PlantsDto>)
    )
)]
#[get("")]
pub async fn find_all(pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::plants::find_all(&pool)).await??;
    Ok(HttpResponse::Ok().json(response))
}



#[derive(Debug, Deserialize)]
pub struct QueryParameters {
    query: String,
    limit: i64
}

/// Endpoint for searching [`PlantsDto`](crate::model::dto::PlantsDto) by their common name or
/// species name.
/// Search parameters are taken from the URLs query string (e.g. .../api/plants/search?query=example&limit=5).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[utoipa::path(
    context_path = "/api/plants",
    responses(
        (status = 200, description = "Search for plants by their common or speices name", body = Vec<PlantsDto>)
    )
)]
#[get("/search")]
pub async fn find(query: web::Query<QueryParameters>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = web::block(move || service::plants::search(&query.query, &query.limit, &pool)).await??;
    Ok(HttpResponse::Ok().json(response))
}
