//! `Images` endpoints.

use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::{
    config::auth::user_info::UserInfo,
    model::dto::actions::{
        Action, CreateBaseLayerImageActionPayload, DeleteBaseLayerImageActionPayload,
        UpdateBaseLayerImageActionPayload,
    },
};
use crate::{config::data::AppDataInner, model::dto::BaseLayerImageDto};
use crate::{model::dto::UpdateBaseLayerImageDto, service::base_layer_images};

/// Endpoint for listing and filtering `Base Layer Images`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/base/{layer_id}/images",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    responses(
        (status = 200, description = "Find base layer images", body = Vec<BaseLayerImageDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(path: Path<(i32, i32)>, app_data: Data<AppDataInner>) -> Result<HttpResponse> {
    let (map_id, layer_id) = path.into_inner();
    let response = base_layer_images::find(&app_data, layer_id).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new `Base Layer Image`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/base/images",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = BaseLayerImageDto,
    responses(
        (status = 201, description = "Create a planting", body = BaseLayerImageDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    path: Path<i32>,
    new_base_layer_image_json: Json<BaseLayerImageDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let dto = base_layer_images::create(new_base_layer_image_json.0, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            path.into_inner(),
            Action::CreateBaseLayerImage(CreateBaseLayerImageActionPayload::new(
                dto.clone(),
                user_info.id,
            )),
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
    request_body = UpdateBaseLayerImageDto,
    responses(
        (status = 200, description = "Update a planting", body = BaseLayerImageDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[patch("/{base_layer_image_id}")]
pub async fn update(
    path: Path<(i32, Uuid)>,
    update_base_layer_image_json: Json<UpdateBaseLayerImageDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, base_layer_image_id) = path.into_inner();
    let update_base_layer_image = update_base_layer_image_json.0;

    let dto =
        base_layer_images::update(base_layer_image_id, update_base_layer_image, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            Action::UpdateBaseLayerImage(UpdateBaseLayerImageActionPayload::new(
                dto.clone(),
                user_info.id,
            )),
        )
        .await;

    Ok(HttpResponse::Ok().json(dto))
}

/// Endpoint for deleting a `BaseLayerImage`.
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
#[delete("/{base_layer_image_id}")]
pub async fn delete(
    path: Path<(i32, Uuid)>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, base_layer_image_id) = path.into_inner();

    base_layer_images::delete_by_id(base_layer_image_id, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            Action::DeleteBaseLayerImage(DeleteBaseLayerImageActionPayload::new(
                base_layer_image_id,
                user_info.id,
            )),
        )
        .await;

    Ok(HttpResponse::Ok().finish())
}
