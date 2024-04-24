//! Layer endpoints.

use actix_web::{
    delete, get, post, put,
    web::{Data, Json, Path, Query},
    HttpResponse, Result,
};

use crate::{
    config::data::AppDataInner,
    model::dto::{layers::LayerRenameDto, LayerSearchParameters},
};
use crate::{model::dto::NewLayerDto, service::layer};

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
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let mut search_params = search_query.into_inner();
    search_params.map_id = Some(map_id.into_inner());

    let response = layer::find(search_params, &app_data).await?;
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
pub async fn find_by_id(
    path: Path<(i32, i32)>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let (_, id) = path.into_inner();
    let response = layer::find_by_id(id, &app_data).await?;
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
pub async fn create(
    path: Path<i32>,
    new_layer: Json<NewLayerDto>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let dto = layer::create(path.into_inner(), new_layer.into_inner(), &app_data).await?;
    Ok(HttpResponse::Created().json(dto))
}

/// Endpoint for reodering layers.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers",
    params(
        ("map_id" = i32, Path, description = "The id of the map"),
    ),
    request_body = Vec<i32>,
    responses(
        (status = 200, description = "Layers have been reordered")
    ),
    security(
        ("oauth2" = [])
    )
)]
#[put("/order")]
pub async fn reorder(
    path: Path<i32>,
    order: Json<Vec<i32>>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    layer::reorder(path.into_inner(), order, &app_data).await?;
    Ok(HttpResponse::Ok().finish())
}

/// Endpoint for renaming layers.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/{layer_id}/name",
    params(
        ("map_id" = i32, Path, description = "The id of the map"),
        ("layer_id" = i32, Path, description = "The id of the layer"),
    ),
    request_body = LayerRenameDto,
    responses(
        (status = 200, description = "Layer has been renamed")
    ),
    security(
        ("oauth2" = [])
    )
)]
#[put("/order")]
pub async fn rename(
    path: Path<i32>,
    dto: Json<LayerRenameDto>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    layer::rename(path.into_inner(), dto.into_inner(), &app_data).await?;
    Ok(HttpResponse::Ok().finish())
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
pub async fn delete(path: Path<(i32, i32)>, app_data: Data<AppDataInner>) -> Result<HttpResponse> {
    let (_, layer_id) = path.into_inner();
    layer::delete_by_id(layer_id, &app_data).await?;
    Ok(HttpResponse::Ok().finish())
}
