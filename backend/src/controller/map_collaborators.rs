use actix_web::{
    get, post,
    web::{Json, Path},
    HttpResponse, Result,
};

use crate::{
    config::{
        auth::user_info::UserInfo,
        data::{SharedHttpClient, SharedKeycloakApi, SharedPool},
    },
    model::dto::NewMapCollaboratorDto,
    service::map_collaborator,
};

/// Endpoint for getting all [`MapCollaborator`](crate::model::entity::MapCollaborator)s of a map.
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If the connection to the Keycloak API could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/collaborators",
    params(
        ("map_id" = i32, Path, description = "The id of the map on which to collaborate"),
    ),
    responses(
        (status = 200, description = "The collaborators of this map", body = Vec<MapCollaboratorDto>),
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    map_id: Path<i32>,
    pool: SharedPool,
    keycloak_api: SharedKeycloakApi,
    http_client: SharedHttpClient,
) -> Result<HttpResponse> {
    let response =
        map_collaborator::get_all(map_id.into_inner(), &pool, &keycloak_api, &http_client).await?;

    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new [`MapCollaborator`](crate::model::entity::MapCollaborator).
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If the connection to the Keycloak API could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/collaborators",
    params(
        ("map_id" = i32, Path, description = "The id of the map on which to collaborate"),
    ),
    request_body = NewMapCollaboratorDto,
    responses(
        (status = 201, description = "Add a new map collaborator", body = MapCollaboratorDto),
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    json: Json<NewMapCollaboratorDto>,
    map_id: Path<i32>,
    user_info: UserInfo,
    pool: SharedPool,
    keycloak_api: SharedKeycloakApi,
    http_client: SharedHttpClient,
) -> Result<HttpResponse> {
    let response = map_collaborator::create(
        json.into_inner(),
        map_id.into_inner(),
        user_info.id,
        &pool,
        &keycloak_api,
        &http_client,
    )
    .await?;

    Ok(HttpResponse::Created().json(response))
}
