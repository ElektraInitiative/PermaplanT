//! `Planting` endpoints.

use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path, Query},
    HttpResponse, Result,
};

use crate::{
    config::{auth::user_info::UserInfo, data::AppDataInner},
    model::dto::{
        actions::Action,
        core::ActionDtoWrapper,
        plantings::{
            DeletePlantingDto, NewPlantingDto, PlantingSearchParameters, UpdatePlantingDto,
        },
    },
    service::plantings,
};

/// Endpoint for listing and filtering `Planting`s.
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
        (status = 200, description = "Find plantings", body = TimelinePagePlantingsDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    // define here, even though it's not used.
    // So clients need to provide the map_id and it is checked.
    _map_id: Path<i32>,
    search_params: Query<PlantingSearchParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = plantings::find(search_params.into_inner(), &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating new `Planting`s.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants/plantings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = ActionDtoWrapperNewPlantings,
    responses(
        (status = 201, description = "Create plantings", body = Vec<PlantingDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    path: Path<i32>,
    new_plantings: Json<ActionDtoWrapper<Vec<NewPlantingDto>>>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let map_id = path.into_inner();

    let ActionDtoWrapper { action_id, dto } = new_plantings.into_inner();

    let created_plantings = plantings::create(dto, map_id, user_info.id, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            Action::new_create_planting_action(&created_plantings, user_info.id, action_id),
        )
        .await;

    Ok(HttpResponse::Created().json(created_plantings))
}

/// Endpoint for updating `Planting`s.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants/plantings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = ActionDtoWrapperUpdatePlantings,
    responses(
        (status = 200, description = "Update plantings", body = Vec<PlantingDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[patch("")]
pub async fn update(
    path: Path<i32>,
    update_planting: Json<ActionDtoWrapper<UpdatePlantingDto>>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let map_id = path.into_inner();

    let ActionDtoWrapper { action_id, dto } = update_planting.into_inner();

    let updated_plantings = plantings::update(dto.clone(), map_id, user_info.id, &app_data).await?;

    let action = match &dto {
        UpdatePlantingDto::Transform(dto) => {
            Action::new_transform_planting_action(dto, user_info.id, action_id)
        }
        UpdatePlantingDto::Move(dto) => {
            Action::new_move_planting_action(dto, user_info.id, action_id)
        }
        UpdatePlantingDto::UpdateAddDate(dto) => {
            Action::new_update_planting_add_date_action(dto, user_info.id, action_id)
        }
        UpdatePlantingDto::UpdateRemoveDate(dto) => {
            Action::new_update_planting_remove_date_action(dto, user_info.id, action_id)
        }
        UpdatePlantingDto::UpdateNote(dto) => {
            Action::new_update_planting_note_action(dto, user_info.id, action_id)
        }
    };

    app_data.broadcaster.broadcast(map_id, action).await;

    Ok(HttpResponse::Ok().json(updated_plantings))
}

/// Endpoint for deleting `Planting`s.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers/plants/plantings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    request_body = ActionDtoWrapperDeletePlantings,
    responses(
        (status = 200, description = "Delete plantings")
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("")]
pub async fn delete(
    path: Path<i32>,
    delete_planting: Json<ActionDtoWrapper<Vec<DeletePlantingDto>>>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let map_id = path.into_inner();

    let ActionDtoWrapper { action_id, dto } = delete_planting.into_inner();

    plantings::delete_by_ids(dto.clone(), map_id, user_info.id, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            Action::new_delete_planting_action(&dto, user_info.id, action_id),
        )
        .await;

    Ok(HttpResponse::Ok().finish())
}
