//! `Images` endpoints.

use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::config::auth::user_info::UserInfo;
use crate::{config::data::AppDataInner, model::dto::BaseLayerImagesDto};
use crate::{model::dto::UpdateBaseLayerImagesDto, service::base_layer_images};

/// Endpoint for listing and filtering `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/base/images",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    responses(
        (status = 200, description = "Find plantings", body = Vec<BaseLayerImagesDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(app_data: Data<AppDataInner>) -> Result<HttpResponse> {
    let response = base_layer_images::find(&app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/base/images",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = BaseLayerImagesDto,
    responses(
        (status = 201, description = "Create a planting", body = BaseLayerImagesDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    path: Path<i32>,
    new_plant_json: Json<BaseLayerImagesDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let dto = base_layer_images::create(new_plant_json.0, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            path.into_inner(),
            unimplemented!(), // TODO
        )
        .await;

    Ok(HttpResponse::Created().json(dto))
}

/// Endpoint for updating a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/base/images",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = UpdateBaseLayerImagesDto,
    responses(
        (status = 200, description = "Update a planting", body = BaseLayerImagesDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[patch("/{planting_id}")]
pub async fn update(
    path: Path<(i32, Uuid)>,
    new_plant_json: Json<UpdateBaseLayerImagesDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, planting_id) = path.into_inner();
    let update_planting = new_plant_json.0;

    let planting = base_layer_images::update(planting_id, update_planting, &app_data).await?;

    // TODO
    app_data
        .broadcaster
        .broadcast(map_id, unimplemented!())
        .await;

    Ok(HttpResponse::Ok().json(planting))
}

/// Endpoint for deleting a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/base/images",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    responses(
        (status = 200, description = "Delete a planting")
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("/{planting_id}")]
pub async fn delete(
    path: Path<(i32, Uuid)>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, planting_id) = path.into_inner();

    base_layer_images::delete_by_id(planting_id, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            // TODO
            unimplemented!(),
        )
        .await;

    Ok(HttpResponse::Ok().finish())
}
