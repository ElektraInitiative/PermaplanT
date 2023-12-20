//! `Shading` endpoints.

use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path, Query},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::{
    config::auth::user_info::UserInfo,
    config::data::AppDataInner,
    model::dto::actions::{
        Action, CreateShadingActionPayload, DeleteShadingActionPayload, UpdateShadingActionPayload,
        UpdateShadingAddDateActionPayload, UpdateShadingRemoveDateActionPayload,
    },
};
use crate::{
    model::dto::shadings::{
        DeleteShadingDto, NewShadingDto, ShadingSearchParameters, UpdateShadingDto,
    },
    service::shadings,
};

/// Endpoint for listing and filtering `Shading`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/shade/shadings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
        ShadingSearchParameters
    ),
    responses(
        (status = 200, description = "Find shadings", body = Vec<ShadingDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_params: Query<ShadingSearchParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = shadings::find(search_params.into_inner(), &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new `Shading`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/shade/shadings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = NewShadingDto,
    responses(
        (status = 201, description = "Create a shading", body = ShadingDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    path: Path<i32>,
    json: Json<NewShadingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let new_shading = json.0;
    let dto = shadings::create(new_shading.clone(), &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            path.into_inner(),
            Action::CreateShading(CreateShadingActionPayload::new(
                dto.clone(),
                user_info.id,
                new_shading.action_id,
            )),
        )
        .await;

    Ok(HttpResponse::Created().json(dto))
}

/// Endpoint for updating a `Shading`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/shade/shadings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = UpdateShadingDto,
    responses(
        (status = 200, description = "Update a shading", body = ShadingDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[patch("/{shading_id}")]
pub async fn update(
    path: Path<(i32, Uuid)>,
    json: Json<UpdateShadingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, shading_id) = path.into_inner();
    let update_shading = json.0;

    let shading = shadings::update(shading_id, update_shading.clone(), &app_data).await?;

    let action = match update_shading {
        UpdateShadingDto::Update(action_dto) => Action::UpdateShading(
            UpdateShadingActionPayload::new(shading.clone(), user_info.id, action_dto.action_id),
        ),
        UpdateShadingDto::UpdateAddDate(action_dto) => Action::UpdateShadingAddDate(
            UpdateShadingAddDateActionPayload::new(&shading, user_info.id, action_dto.action_id),
        ),
        UpdateShadingDto::UpdateRemoveDate(action_dto) => Action::UpdateShadingRemoveDate(
            UpdateShadingRemoveDateActionPayload::new(&shading, user_info.id, action_dto.action_id),
        ),
    };

    app_data.broadcaster.broadcast(map_id, action).await;

    Ok(HttpResponse::Ok().json(shading))
}

/// Endpoint for deleting a `Shading`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/shade/shadings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = DeleteShadingDto,
    responses(
        (status = 200, description = "Delete a shading")
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("/{shading_id}")]
pub async fn delete(
    path: Path<(i32, Uuid)>,
    json: Json<DeleteShadingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, shading_id) = path.into_inner();
    let delete_shading = json.0;

    shadings::delete_by_id(shading_id, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            Action::DeleteShading(DeleteShadingActionPayload::new(
                shading_id,
                user_info.id,
                delete_shading.action_id,
            )),
        )
        .await;

    Ok(HttpResponse::Ok().finish())
}
