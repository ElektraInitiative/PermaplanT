//! `Planting` endpoints.

use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path, Query},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::{
    config::auth::user_info::UserInfo,
    model::dto::actions::{
        Action, UpdatePlantingAddDateActionPayload, UpdatePlantingRemoveDateActionPayload,
    },
};
use crate::{
    config::data::AppDataInner,
    model::dto::actions::{
        CreatePlantActionPayload, DeletePlantActionPayload, MovePlantActionPayload,
        TransformPlantActionPayload,
    },
};
use crate::{
    model::dto::plantings::{
        DeletePlantingDto, NewPlantingDto, PlantingSearchParameters, UpdatePlantingDto,
    },
    service::plantings,
};

/// Endpoint for listing and filtering `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants/plantings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
        PlantingSearchParameters
    ),
    responses(
        (status = 200, description = "Find plantings", body = Vec<PlantingDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_params: Query<PlantingSearchParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = plantings::find(search_params.into_inner(), &app_data).await?;
    Ok(HttpResponse::Ok().json(response.clone()))
}

/// Endpoint for creating a new `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants/plantings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = NewPlantingDto,
    responses(
        (status = 201, description = "Create a planting", body = PlantingDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    path: Path<i32>,
    json: Json<NewPlantingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let new_planting = json.0;
    let dto = plantings::create(new_planting.clone(), &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            path.into_inner(),
            Action::CreatePlanting(CreatePlantActionPayload::new(
                dto.clone(),
                user_info.id,
                new_planting.action_id,
            )),
        )
        .await;

    Ok(HttpResponse::Created().json(dto.clone()))
}

/// Endpoint for updating a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants/plantings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = UpdatePlantingDto,
    responses(
        (status = 200, description = "Update a planting", body = PlantingDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[patch("/{planting_id}")]
pub async fn update(
    path: Path<(i32, Uuid)>,
    json: Json<UpdatePlantingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, planting_id) = path.into_inner();
    let update_planting = json.0;

    let planting = plantings::update(planting_id, update_planting, &app_data).await?;

    let action = match update_planting {
        UpdatePlantingDto::Transform(action_dto) => Action::TransformPlanting(
            TransformPlantActionPayload::new(planting.clone(), user_info.id, action_dto.action_id),
        ),
        UpdatePlantingDto::Move(action_dto) => Action::MovePlanting(MovePlantActionPayload::new(
            planting.clone(),
            user_info.id,
            action_dto.action_id,
        )),
        UpdatePlantingDto::UpdateAddDate(action_dto) => {
            Action::UpdatePlantingAddDate(UpdatePlantingAddDateActionPayload::new(
                planting.clone(),
                user_info.id,
                action_dto.action_id,
            ))
        }
        UpdatePlantingDto::UpdateRemoveDate(action_dto) => {
            Action::UpdatePlantingRemoveDate(UpdatePlantingRemoveDateActionPayload::new(
                planting.clone(),
                user_info.id,
                action_dto.action_id,
            ))
        }
    };

    app_data.broadcaster.broadcast(map_id, action).await;

    Ok(HttpResponse::Ok().json(planting.clone()))
}

/// Endpoint for deleting a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants/plantings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = DeletePlantingDto,
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
    json: Json<DeletePlantingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, planting_id) = path.into_inner();
    let delete_planting = json.0;

    plantings::delete_by_id(planting_id, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            Action::DeletePlanting(DeletePlantActionPayload::new(
                planting_id,
                user_info.id,
                delete_planting.action_id,
            )),
        )
        .await;

    Ok(HttpResponse::Ok().finish())
}
