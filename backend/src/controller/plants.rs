//! `Plants` endpoints.

use crate::model::dto::{PageParameters, PlantsSearchParameters};
use crate::{db::connection::Pool, service};
use actix_web::{
    get,
    web::{Data, Path, Query},
    HttpResponse, Result,
};

/// Endpoint for fetching or searching all [`PlantsSummaryDto`](crate::model::dto::PlantsSummaryDto).
/// Search parameters are taken from the URLs query string (e.g. .../api/plants/search?name=example&per_page=5).
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
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<PlantsSearchParameters>,
    page_query: Query<PageParameters>,
    pool: Data<Pool>,
) -> Result<HttpResponse> {
    let payload =
        service::plants::find(search_query.into_inner(), page_query.into_inner(), &pool).await?;
    Ok(HttpResponse::Ok().json(payload))
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
