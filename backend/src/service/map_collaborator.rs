use actix_http::StatusCode;
use uuid::Uuid;

use crate::{
    config::data::{SharedHttpClient, SharedKeycloakApi, SharedPool},
    error::ServiceError,
    model::{
        dto::{DeleteMapCollaboratorDto, MapCollaboratorDto, NewMapCollaboratorDto},
        entity::{Map, MapCollaborator},
    },
    service::users,
};

/// Get all collaborators for a map.
///
/// # Errors
/// * If the connection to the database could not be established.
/// * If the connection to the Keycloak API could not be established.
pub async fn get_all(
    map_id: i32,
    pool: &SharedPool,
    keycloak_api: &SharedKeycloakApi,
    http_client: &SharedHttpClient,
) -> Result<Vec<MapCollaboratorDto>, ServiceError> {
    let mut conn = pool.get().await?;
    // Check if map exists
    let _ = Map::find_by_id(map_id, &mut conn).await?;

    let collaborators = MapCollaborator::find_by_map_id(map_id, &mut conn).await?;

    let collaborator_ids = collaborators.iter().map(|c| c.user_id).collect::<Vec<_>>();
    let users = users::find_by_ids(collaborator_ids, keycloak_api, http_client).await?;

    let dtos = collaborators
        .into_iter()
        .zip(users.into_iter())
        .map(|(c, u)| MapCollaboratorDto::from((c, u)))
        .collect::<Vec<MapCollaboratorDto>>();

    Ok(dtos)
}

/// Create a new collaborator for a map.
///
/// # Errors
/// * If the user tries to add themselves as a collaborator.
/// * If the user is not the creator of the map.
/// * If the map already has 30 collaborators.
/// * If the connection to the database could not be established.
/// * If the connection to the Keycloak API could not be established.
pub async fn create(
    map_and_collaborator: (i32, NewMapCollaboratorDto),
    user_id: Uuid,
    pool: &SharedPool,
    keycloak_api: &SharedKeycloakApi,
    http_client: &SharedHttpClient,
) -> Result<MapCollaboratorDto, ServiceError> {
    let (map_id, ref new_map_collaborator) = map_and_collaborator;

    if new_map_collaborator.user_id == user_id {
        return Err(ServiceError::new(
            StatusCode::BAD_REQUEST,
            "You cannot add yourself as a collaborator.".to_owned(),
        ));
    }

    let mut conn = pool.get().await?;

    let map = Map::find_by_id(map_id, &mut conn).await?;

    if map.owner_id != user_id {
        return Err(ServiceError::new(
            StatusCode::FORBIDDEN,
            "You are not the owner of this map.".to_owned(),
        ));
    }

    let current_collaborators = MapCollaborator::find_by_map_id(map_id, &mut conn).await?;

    if current_collaborators.len() >= 30 {
        return Err(ServiceError::new(
            StatusCode::BAD_REQUEST,
            "A map can have at most 30 collaborators.".to_owned(),
        ));
    }

    let collaborator_user =
        users::find_by_id(new_map_collaborator.user_id, keycloak_api, http_client).await?;

    let collaborator = MapCollaborator::create(map_and_collaborator, &mut conn).await?;

    Ok(MapCollaboratorDto::from((collaborator, collaborator_user)))
}

/// Remove a collaborator from a map.
///
/// # Errors
/// * If the user is not the creator of the map.
/// * If the connection to the database could not be established.
/// * If the connection to the Keycloak API could not be established.
pub async fn delete(
    map_and_dto: (i32, DeleteMapCollaboratorDto),
    user_id: Uuid,
    pool: &SharedPool,
) -> Result<(), ServiceError> {
    let (map_id, _) = map_and_dto;

    let mut conn = pool.get().await?;

    let map = Map::find_by_id(map_id, &mut conn).await?;

    if map.owner_id != user_id {
        return Err(ServiceError::new(
            StatusCode::FORBIDDEN,
            "You are not the creator of this map.".to_owned(),
        ));
    }

    MapCollaborator::delete(map_and_dto, &mut conn).await?;

    Ok(())
}
