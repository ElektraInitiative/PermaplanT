//! `Shading` endpoints.

use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path, Query},
    HttpResponse, Result,
};

use crate::model::dto::actions::Action;
use crate::model::dto::core::ActionDtoWrapper;
use crate::{config::auth::user_info::UserInfo, config::data::AppDataInner};
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
    new_shadings: Json<ActionDtoWrapper<Vec<NewShadingDto>>>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let map_id = path.into_inner();

    let ActionDtoWrapper { action_id, dto } = new_shadings.into_inner();

    let created_shadings = shadings::create(dto, &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            Action::new_create_shading_action(&created_shadings, user_info.id, action_id),
        )
        .await;

    Ok(HttpResponse::Created().json(created_shadings))
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
    request_body = ActionDtoWrapperUpdateShadings,
    responses(
        (status = 200, description = "Update a shading", body = Vec<ShadingDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[patch("")]
pub async fn update(
    path: Path<i32>,
    update_shading: Json<ActionDtoWrapper<UpdateShadingDto>>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let map_id = path.into_inner();

    let ActionDtoWrapper { action_id, dto } = update_shading.into_inner();

    let shading = shadings::update(dto.clone(), &app_data).await?;

    let action = match &dto {
        UpdateShadingDto::Update(dto) => {
            Action::new_update_shading_action(dto, user_info.id, action_id)
        }
        UpdateShadingDto::UpdateAddDate(dto) => {
            Action::new_update_shading_add_date_action(dto, user_info.id, action_id)
        }
        UpdateShadingDto::UpdateRemoveDate(dto) => {
            Action::new_update_shading_remove_date_action(dto, user_info.id, action_id)
        }
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
#[delete("")]
pub async fn delete(
    path: Path<i32>,
    delete_shadings: Json<ActionDtoWrapper<Vec<DeleteShadingDto>>>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let map_id = path.into_inner();

    let ActionDtoWrapper { action_id, dto } = delete_shadings.into_inner();

    shadings::delete_by_ids(dto.clone(), &app_data).await?;

    app_data
        .broadcaster
        .broadcast(
            map_id,
            Action::new_delete_shading_action(&dto, user_info.id, action_id),
        )
        .await;

    Ok(HttpResponse::Ok().finish())
}
