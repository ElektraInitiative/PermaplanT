//! Plant layer endpoints.

use actix_web::{
    get,
    web::{Data, Path},
    HttpResponse, Result,
};
use actix_web_lab::extract::Query;

use crate::{
    config::data::AppDataInner,
    model::dto::{HeatMapQueryParams, RelationSearchParameters},
    service::plant_layer,
};

#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
        HeatMapQueryParams
    ),
    responses(
        (status = 200, description = "Generate a heatmap to find ideal locations to plant the plant", body = Vec<Vec<f64>>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/heatmap")]
pub async fn heatmap(
    query_params: Query<HeatMapQueryParams>,
    map_id: Path<i32>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response =
        plant_layer::heatmap(map_id.into_inner(), query_params.into_inner(), &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for finding all relations of a certain plant.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on (TODO: currently unused)"),
        RelationSearchParameters
    ),
    responses(
        (status = 200, description = "Find relations to given plant", body = RelationsDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/relations")]
pub async fn find_relations(
    search_query: Query<RelationSearchParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = plant_layer::find_relations(search_query.into_inner(), &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}
