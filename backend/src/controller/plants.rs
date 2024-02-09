//! `Plants` endpoints.

use actix_web::{
    get,
    web::{Path, Query},
    HttpResponse, Result,
};

use crate::{
    config::data::SharedPool,
    model::dto::{PageParameters, PlantsSearchParameters},
    service::plants,
};

/// Endpoint for fetching or searching [`PlantsSummaryDto`](crate::model::dto::PlantsSummaryDto).
/// Search parameters are taken from the URLs query string (e.g. .../api/plants?name=example&per_page=5).
/// If no page parameters are provided, the first page is returned.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plants",
    params(
        PlantsSearchParameters,
        PageParameters,
    ),
    responses(
        (status = 200, description = "Fetch or search for all plants", body = PagePlantsSummaryDto),
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<PlantsSearchParameters>,
    page_query: Query<PageParameters>,
    pool: SharedPool,
) -> Result<HttpResponse> {
    let payload = plants::find(search_query.into_inner(), page_query.into_inner(), &pool).await?;
    Ok(HttpResponse::Ok().json(payload))
}

/// Endpoint for fetching a [`Plant`](crate::model::entity::Plants).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plants",
    responses(
        (status = 200, description = "Fetch plant by id", body = PlantsSummaryDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/{id}")]
pub async fn find_by_id(id: Path<i32>, pool: SharedPool) -> Result<HttpResponse> {
    let response = plants::find_by_id(*id, &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}
