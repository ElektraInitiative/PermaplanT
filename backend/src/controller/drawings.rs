//! `Drawings` endpoints.

use actix_web::{
    delete, get, patch, post,
    web::{Data, Json, Path},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::{
    config::{auth::user_info::UserInfo, data::AppDataInner},
    model::dto::drawings::DrawingDto,
    service,
};

/// Endpoint for listing and filtering `Drawing`s.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/drawings",
    params(
        ("map_id" = i32, Path, description = "The id of the map the layer is on"),
    ),
    responses(
        (status = 200, description = "Find drawings", body = Vec<DrawingDto>)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(map_id: Path<i32>, app_data: Data<AppDataInner>) -> Result<HttpResponse> {
    let response = service::drawings::find(map_id.into_inner(), &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating new `Drawings`s.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/drawings",
    params(
        ("map_id" = i32, Path, description = "The id of the map"),
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
    new_drawings: Json<Vec<DrawingDto>>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let map_id = path.into_inner();
    let created_plantings = service::drawings::create(new_drawings.into_inner(), &app_data).await?;
    Ok(HttpResponse::Created().json(created_plantings))
}

/// Endpoint for updating `Drawings`s.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/drawings",
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
    update_drawings: Json<Vec<DrawingDto>>,
    app_data: Data<AppDataInner>,
    user_info: UserInfo,
) -> Result<HttpResponse> {
    let map_id = path.into_inner();
    let updated_plantings =
        service::drawings::update(update_drawings.into_inner(), &app_data).await?;
    Ok(HttpResponse::Ok().json(updated_plantings))
}

/// Endpoint for deleting `Drawings`s.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/drawings",
    params(
        ("map_id" = i32, Path, description = "The id of the map"),
    ),
    request_body = ActionDtoWrapperDeletePlantings,
    responses(
        (status = 200, description = "Drawings have been deleted")
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("")]
pub async fn delete(
    path: Path<i32>,
    delete_drawings: Json<Vec<Uuid>>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let map_id = path.into_inner();
    service::drawings::delete_by_ids(delete_drawings.into_inner(), &app_data).await?;
    Ok(HttpResponse::Ok().finish())
}
