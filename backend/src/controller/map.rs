//! `Map` endpoints.

use actix_web::web::Query;
use actix_web::{
    get, post,
    web::{Data, Json, Path},
    HttpResponse, Result,
};

use crate::config::auth::user_info::UserInfo;
use crate::config::data::AppDataInner;
use crate::model::dto::{MapSearchParameters, PageParameters};
use crate::{model::dto::NewMapDto, service};

#[utoipa::path(
    context_path = "/api/maps",
    responses(
        (status = 200, description = "Fetch or search all maps", body = PageMapDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/heatmap")]
pub async fn heatmap(app_data: Data<AppDataInner>) -> Result<HttpResponse> {
    // TODO: figure out where to put endpoints
    // TODO: get params from request
    let map_id = 1;
    let plant_id = 1;
    let response = service::map::heatmap(map_id, plant_id, &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

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
