//! `Map` endpoints.

use actix_web::web::Query;
use actix_web::{
    get, post,
    web::{Data, Json, Path},
    HttpResponse, Result,
};

use crate::model::dto::{
    MapSearchParameters, MapVersionSearchParameters, NewMapVersionDto, PageParameters,
};
use crate::{db::connection::Pool, model::dto::NewMapDto, service};

/// Endpoint for fetching or searching all [`Map`](crate::model::entity::Map).
/// Search parameters are taken from the URLs query string (e.g. .../api/maps?is_inactive=false&per_page=5).
/// If no page parameters are provided, the first page is returned.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/users/{user_id}/maps",
    params(
        MapSearchParameters,
        PageParameters
    ),
    responses(
        (status = 200, description = "Fetch or search all maps", body = PageMapDto)
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<MapSearchParameters>,
    page_query: Query<PageParameters>,
    pool: Data<Pool>,
) -> Result<HttpResponse> {
    let response =
        service::map::find(search_query.into_inner(), page_query.into_inner(), &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for fetching a [`Map`](crate::model::entity::Map).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/users/{user_id}/maps/{map_id}",
    responses(
        (status = 200, description = "Fetch a map by id", body = MapDto)
    )
)]
#[get("/{map_id}")]
pub async fn find_by_id(map_id: Path<i32>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = service::map::find_by_id(*map_id, &pool).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new [`Map`](crate::model::entity::Map).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/users/{user_id}/maps",
    request_body = NewMapDto,
    responses(
        (status = 201, description = "Create a new map", body = MapDto)
    )
)]
#[post("")]
pub async fn create(new_map_json: Json<NewMapDto>, pool: Data<Pool>) -> Result<HttpResponse> {
    let response = service::map::create(new_map_json.0, &pool).await?;
    Ok(HttpResponse::Created().json(response))
}

/// Endpoint for fetching or searching all [`MapVersion`](crate::model::entity::MapVersion).
/// Search parameters are taken from the URLs query string (e.g. .../api/maps?map_id=1&per_page=5).
/// If no page parameters are provided, the first page is returned.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/users/{user_id}/maps",
    params(
        MapVersionSearchParameters,
        PageParameters
    ),
    responses(
        (status = 200, description = "Fetch or search all map versions", body = PageMapVersionDto)
    )
)]
#[get("/{map_id}/versions")]
pub async fn show_versions(
    search_query: Query<MapVersionSearchParameters>,
    page_query: Query<PageParameters>,
    pool: Data<Pool>,
) -> Result<HttpResponse> {
    let response =
        service::map::show_versions(search_query.into_inner(), page_query.into_inner(), &pool)
            .await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for saving a new [`MapVersion`](crate::model::entity::MapVersion).
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/users/{user_id}/maps",
    request_body = NewMapVersionDto,
    responses(
        (status = 201, description = "Save a new map version", body = MapVersionDto)
    )
)]
#[post("/{map_id}/versions")]
pub async fn save_snapshot(
    new_map_version_json: Json<NewMapVersionDto>,
    pool: Data<Pool>,
) -> Result<HttpResponse> {
    let response = service::map::save_snapshot(new_map_version_json.0, &pool).await?;
    Ok(HttpResponse::Created().json(response))
}
