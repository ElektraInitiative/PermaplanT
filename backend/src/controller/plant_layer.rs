//! Plant layer endpoints.

use actix_web::{
    get,
    web::{Data, Path, Query},
    HttpResponse, Result,
};

use crate::{
    config::data::AppDataInner,
    model::dto::{HeatMapQueryParams, RelationSearchParameters},
    service::plant_layer,
};

/// Endpoint for generating a heatmap signaling ideal locations for planting the plant.
///
/// The heatmap will be an exact fit on the maps geometry.
/// This means if the maps y_min is 100 the generated heatmap will need to be moved to start at y=100.
///
/// x=0,y=0     ... bottom left
/// x=0,y=100   ... top left
/// x=100,y=100 ... top right
/// x=100,y=0   ... bottom right
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
        HeatMapQueryParams
    ),
    responses(
        (status = 200, description = "Returns the heatmap.", body = Vec<u8>, content_type = "image/png")
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
    Ok(HttpResponse::Ok().content_type("image/png").body(response))
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
