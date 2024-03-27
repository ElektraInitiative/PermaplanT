//! `Map` endpoints.

use actix_web::web::Query;
use actix_web::{
    get, patch, post,
    web::{Data, Json, Path},
    HttpResponse, Result,
};
use uuid::Uuid;

use crate::config::auth::user_info::UserInfo;
use crate::config::data::AppDataInner;
use crate::model::dto::actions::{Action, ActionType, UpdateMapGeometryActionPayload};
use crate::model::dto::{MapSearchParameters, PageParameters, UpdateMapDto, UpdateMapGeometryDto};
use crate::{model::dto::NewMapDto, service};

/// Endpoint for fetching or searching all [`Map`](crate::model::entity::Map).
/// Search parameters are taken from the URLs query string (e.g. .../api/maps?is_inactive=false&per_page=5).
/// If no page parameters are provided, the first page is returned.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps",
    params(
        MapSearchParameters,
        PageParameters
    ),
    responses(
        (status = 200, description = "Fetch or search all maps", body = PageMapDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<MapSearchParameters>,
    page_query: Query<PageParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = service::map::find(
        search_query.into_inner(),
        page_query.into_inner(),
        &app_data,
    )
    .await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for fetching a [`Map`](crate::model::entity::Map).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps",
    responses(
        (status = 200, description = "Fetch a map by id", body = MapDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/{map_id}")]
pub async fn find_by_id(map_id: Path<i32>, app_data: Data<AppDataInner>) -> Result<HttpResponse> {
    let response = service::map::find_by_id(*map_id, &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new [`Map`](crate::model::entity::Map).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps",
    request_body = NewMapDto,
    responses(
        (status = 201, description = "Create a new map", body = MapDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    new_map_json: Json<NewMapDto>,
    user_info: UserInfo,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = service::map::create(new_map_json.0, user_info.id, &app_data).await?;
    Ok(HttpResponse::Created().json(response))
}

/// Endpoint for updating a [`Map`](crate::model::entity::Map).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps",
    request_body = UpdateMapDto,
    responses(
        (status = 200, description = "Update a map", body = MapDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[patch("/{map_id}")]
pub async fn update(
    map_update_json: Json<UpdateMapDto>,
    map_id: Path<i32>,
    user_info: UserInfo,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = service::map::update(
        map_update_json.0,
        map_id.into_inner(),
        user_info.id,
        &app_data,
    )
    .await?;
    Ok(HttpResponse::Ok().json(response))
}
/// Endpoint for updating the [´Geometry`] of a [`Map`](crate::model::entity::Map).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
context_path = "/api/maps",
request_body = UpdateMapDto,
responses(
(status = 200, description = "Update a map", body = MapDto)
),
security(
("oauth2" = [])
)
)]
#[patch("/{map_id}/geometry")]
pub async fn update_geometry(
    map_update_geometry_json: Json<UpdateMapGeometryDto>,
    map_id: Path<i32>,
    user_info: UserInfo,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let map_id_inner = map_id.into_inner();

    let response = service::map::update_geomtery(
        map_update_geometry_json.0.clone(),
        map_id_inner,
        user_info.id,
        &app_data,
    )
    .await?;

    app_data
        .broadcaster
        .broadcast(
            map_id_inner,
            Action {
                action_id: Uuid::new_v4(),
                user_id: user_info.id,
                action: ActionType::UpdateMapGeometry(UpdateMapGeometryActionPayload::new(
                    map_update_geometry_json.0,
                    map_id_inner,
                )),
            },
        )
        .await;

    Ok(HttpResponse::Ok().json(response))
}
