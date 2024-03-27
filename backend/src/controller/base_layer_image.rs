//! `BaseLayerImage` endpoints.

use actix_web::{
    delete, get, patch, post,
    web::{Json, Path},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::config::data::{SharedBroadcaster, SharedPool};
use crate::{
    config::auth::user_info::UserInfo,
    model::dto::{
        actions::{
            Action, CreateBaseLayerImageActionPayload, DeleteBaseLayerImageActionPayload,
            UpdateBaseLayerImageActionPayload,
        },
        BaseLayerImageDto, DeleteBaseLayerImageDto, UpdateBaseLayerImageDto,
    },
    service::base_layer_images,
};

/// Endpoint for listing and filtering `BaseLayerImage`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/base/{layer_id}/images",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
        ("layer_id" = i32, Path, description = "The id of the layer"),
    ),
    responses(
        (status = 200, description = "Find base layer images", body = Vec<BaseLayerImageDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(path: Path<(i32, i32)>, pool: SharedPool) -> Result<HttpResponse> {
    let (_map_id, layer_id) = path.into_inner();
    let response = base_layer_images::find(&pool, layer_id).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new `BaseLayerImage`.
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
    json: Json<BaseLayerImageDto>,
    user_info: UserInfo,
    pool: SharedPool,
    broadcaster: SharedBroadcaster,
) -> Result<HttpResponse> {
    let create_dto = json.0;
    let dto = base_layer_images::create(create_dto.clone(), &pool).await?;

    broadcaster
        .broadcast(
            path.into_inner(),
            Action::CreateBaseLayerImage(CreateBaseLayerImageActionPayload::new(
                dto.clone(),
                user_info.id,
                create_dto.action_id,
            )),
        )
        .await;

    Ok(HttpResponse::Created().json(dto))
}

/// Endpoint for updating a `BaseLayerImage`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/base/images",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
        ("base_layer_image_id" = Uuid, Path, description = "The id of the BaseLayerImage to update"),
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
    json: Json<UpdateBaseLayerImageDto>,
    user_info: UserInfo,
    pool: SharedPool,
    broadcaster: SharedBroadcaster,
) -> Result<HttpResponse> {
    let (map_id, base_layer_image_id) = path.into_inner();
    let update_base_layer_image = json.0;

    let dto =
        base_layer_images::update(base_layer_image_id, update_base_layer_image.clone(), &pool)
            .await?;

    broadcaster
        .broadcast(
            map_id,
            Action::UpdateBaseLayerImage(UpdateBaseLayerImageActionPayload::new(
                dto.clone(),
                user_info.id,
                update_base_layer_image.action_id,
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
        ("base_layer_image_id" = Uuid, Path, description = "The id of the BaseLayerImage to delete"),
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
    json: Json<DeleteBaseLayerImageDto>,
    user_info: UserInfo,
    pool: SharedPool,
    broadcaster: SharedBroadcaster,
) -> Result<HttpResponse> {
    let (map_id, base_layer_image_id) = path.into_inner();
    let delete_dto = json.0;

    base_layer_images::delete_by_id(base_layer_image_id, &pool).await?;

    broadcaster
        .broadcast(
            map_id,
            Action::DeleteBaseLayerImage(DeleteBaseLayerImageActionPayload::new(
                base_layer_image_id,
                user_info.id,
                delete_dto.action_id,
            )),
        )
        .await;

    Ok(HttpResponse::Ok().finish())
}
