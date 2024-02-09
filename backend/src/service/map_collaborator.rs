use actix_http::StatusCode;
use actix_web::web::Data;
use uuid::Uuid;

use crate::{
    config::data::AppDataInner,
    error::ServiceError,
    model::{
        dto::{MapCollaboratorDto, NewMapCollaboratorDto},
        entity::{Map, MapCollaborator},
    },
    service::users,
};

pub async fn create(
    new_map_collaborator: NewMapCollaboratorDto,
    map_id: i32,
    user_id: Uuid,
    app_data: &Data<AppDataInner>,
) -> Result<MapCollaboratorDto, ServiceError> {
    if new_map_collaborator.map_id != map_id {
        return Err(ServiceError::new(
            StatusCode::BAD_REQUEST,
            "Path and body map_id do not match".to_owned(),
        ));
    }
    if new_map_collaborator.user_id == user_id {
        return Err(ServiceError::new(
            StatusCode::BAD_REQUEST,
            "You cannot add yourself as a collaborator.".to_owned(),
        ));
    }

    let mut conn = app_data.pool.get().await?;

    let map = Map::find_by_id(new_map_collaborator.map_id, &mut conn).await?;
    let collaborator = users::find_by_id(new_map_collaborator.user_id, app_data).await?;

    if map.owner_id != user_id {
        return Err(ServiceError::new(
            StatusCode::FORBIDDEN,
            "You are not the owner of this map.".to_owned(),
        ));
    }

    let result = MapCollaborator::create(new_map_collaborator, &mut conn).await?;

    Ok(MapCollaboratorDto::from((result, collaborator)))
}
