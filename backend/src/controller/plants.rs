//! `Plants` endpoints.

use crate::{config::db::Pool, model::dto::PlantsSearchParameters, service};
use actix_web::{
    get,
    web::{Data, Path, Query},
    HttpResponse, Result,
};

/// Endpoint for fetching or searching all [`PlantsSummaryDto`](crate::model::dto::PlantsSummaryDto).
/// Search parameters are taken from the URLs query string (e.g. .../api/plants/search?query=example&limit=5).
/// If no query parameters are provided, all plants are returned as a simple list.
/// Otherwhise they are returned as part of a [`PlantsSearchDto`](crate::model::dto::PlantsSearchDto)
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plants",
    responses(
        (status = 200, description = "Fetch or search for all plants", body = Vec<PlantsSummaryDto>),
        (status = 200, description = "If all query parameters are set: Search plants by their common name or species name", body = PlantsSearchDto)
    )
)]
#[get("")]
pub async fn find_all_or_search(
    query: Option<Query<PlantsSearchParameters>>,
    pool: Data<Pool>,
) -> Result<HttpResponse> {
    let response = if let Some(parameters) = query {
        let response = service::plants::search(&pool, &parameters).await?;
        HttpResponse::Ok().json(response)
    } else {
        let response = service::plants::find_all(&pool).await?;
        HttpResponse::Ok().json(response)
    };

    Ok(response)
}

/// Endpoint for fetching a [`Plant`](crate::model::entity::Plants).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plants/{id}",
    responses(
        (status = 200, description = "Fetch plant by id", body = PlantsSummaryDto)
    )
)]
#[get("/{id}")]
pub async fn find_by_id(id: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = service::plants::find_by_id(*id, &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}
