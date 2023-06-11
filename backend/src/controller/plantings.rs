//! `Planting` endpoints.

use actix_web::{
    delete, error, get, patch, post,
    web::{Data, Json, Path, Query},
    HttpResponse, Result,
};

use crate::{config::auth::user_info::UserInfo, model::dto::actions::Action};
use crate::{
    config::data::AppDataInner,
    model::dto::actions::{
        CreatePlantActionPayload, DeletePlantActionPayload, MovePlantActionPayload,
        TransformPlantActionPayload,
    },
};
use crate::{
    model::dto::{NewPlantingDto, PageParameters, PlantingSearchParameters, UpdatePlantingDto},
    service::plantings,
};

/// Endpoint for listing and filtering `Planting`.
/// If no page parameters are provided, the first page is returned.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plantings",
    params(
        PlantingSearchParameters,
        PageParameters
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
    page_parameters: Query<PageParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = plantings::find(
        search_params.into_inner(),
        page_parameters.into_inner(),
        &app_data,
    )
    .await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plantings",
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
    new_plant_json: Json<NewPlantingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let dto = plantings::create(new_plant_json.0, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            path.into_inner(),
            Action::CreatePlanting(CreatePlantActionPayload::new(dto, user_info.id)),
        )
        .await;

    Ok(HttpResponse::Created().json(dto))
}

/// Endpoint for updating a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plantings",
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
    path: Path<(i32, i32)>,
    new_plant_json: Json<UpdatePlantingDto>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, planting_id) = path.into_inner();

    let (planting, action) = match *new_plant_json {
        UpdatePlantingDto {
            x: Some(x),
            y: Some(y),
            rotation: Some(rotation),
            scale_x: Some(scale_x),
            scale_y: Some(scale_y),
            ..
        } => {
            let new_planting = UpdatePlantingDto {
                x: Some(x),
                y: Some(y),
                rotation: Some(rotation),
                scale_x: Some(scale_x),
                scale_y: Some(scale_y),
                ..Default::default()
            };
            let planting = plantings::update(planting_id, new_planting, &app_data).await?;

            (
                planting,
                Action::TransformPlanting(TransformPlantActionPayload::new(planting, user_info.id)),
            )
        }
        UpdatePlantingDto {
            x: Some(x),
            y: Some(y),
            ..
        } => {
            let new_planting = UpdatePlantingDto {
                x: Some(x),
                y: Some(y),
                ..Default::default()
            };
            let planting = plantings::update(planting_id, new_planting, &app_data).await?;

            (
                planting,
                Action::MovePlanting(MovePlantActionPayload::new(planting, user_info.id)),
            )
        }
        _ => {
            return Err(error::ErrorBadRequest(
                "Invalid arguments passed for update planting",
            ))
        }
    };

    app_data.broadcaster.broadcast(map_id, action).await;

    Ok(HttpResponse::Ok().json(planting))
}

/// Endpoint for deleting a `Planting`.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/plantings",
    responses(
        (status = 200, description = "Delete a planting", body = String)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("/{planting_id}")]
pub async fn delete(
    path: Path<(i32, i32)>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let (map_id, planting_id) = path.into_inner();

    plantings::delete_by_id(planting_id, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            Action::DeletePlanting(DeletePlantActionPayload::new(planting_id, user_info.id)),
        )
        .await;

    Ok(HttpResponse::Ok().finish())
}
