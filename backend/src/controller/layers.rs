//! Layer endpoints.

use actix_web::{
    delete, get, post,
    web::{Json, Path, Query},
    HttpResponse, Result,
};

use crate::model::dto::NewLayerDto;
use crate::{config::data::SharedPool, model::dto::LayerSearchParameters, service::layer};

/// Endpoint for searching layers.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
        LayerSearchParameters,
    ),
    responses(
        (status = 200, description = "Search layers", body = VecLayerDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<LayerSearchParameters>,
    map_id: Path<i32>,
    pool: SharedPool,
) -> Result<HttpResponse> {
    let mut search_params = search_query.into_inner();
    search_params.map_id = Some(map_id.into_inner());

    let response = layer::find(search_params, &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for fetching a layer by its id.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    responses(
        (status = 200, description = "Fetch layer by id", body = LayerDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/{id}")]
pub async fn find_by_id(path: Path<(i32, i32)>, pool: SharedPool) -> Result<HttpResponse> {
    let (_, id) = path.into_inner();
    let response = layer::find_by_id(id, &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new layer.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = NewLayerDto,
    responses(
        (status = 201, description = "Create a plant layer", body = LayerDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(new_layer: Json<NewLayerDto>, pool: SharedPool) -> Result<HttpResponse> {
    let dto = layer::create(new_layer.0, &pool).await?;
    Ok(HttpResponse::Created().json(dto))
}

/// Endpoint for deleting a layer.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    responses(
        (status = 200, description = "Delete a layer")
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("/{id}")]
pub async fn delete(path: Path<(i32, i32)>, pool: SharedPool) -> Result<HttpResponse> {
    let (_, layer_id) = path.into_inner();
    layer::delete_by_id(layer_id, &pool).await?;
    Ok(HttpResponse::Ok().finish())
}
