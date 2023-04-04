//! `Plants` endpoints.

use crate::{config::db::Pool, model::dto::PlantsSearchParameters, service};
use actix_web::{
    get,
    web::{self, Data, Path},
    HttpResponse, Result,
};

/// Endpoint for fetching or searching all [`PlantsSummaryDto`](crate::model::dto::PlantsSummaryDto).
/// Search parameters are taken from the URLs query string (e.g. .../api/plants/search?query=example&limit=5).
/// If no query parameters are provided, all plants are returned.
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If [web::block] fails.
#[utoipa::path(
    context_path = "/api/plants",
    responses(
        (status = 200, description = "Fetch or search for all plants by their common or species name", body = Vec<PlantsSummaryDto>)
    )
)]
#[get("")]
pub async fn find_all_or_search(
    query: Option<web::Query<PlantsSearchParameters>>,
    pool: Data<Pool>,
) -> Result<HttpResponse> {
    let response = match query {
        Some(parameters) => {
            web::block(move || service::plants::search(&pool, &parameters)).await??
        }
        None => web::block(move || service::plants::find_all(&pool)).await??,
    };
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
