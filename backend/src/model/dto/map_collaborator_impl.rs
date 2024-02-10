use crate::{keycloak_api::UserDto, model::entity::MapCollaborator};

use super::MapCollaboratorDto;

impl From<(MapCollaborator, UserDto)> for MapCollaboratorDto {
    fn from(value: (MapCollaborator, UserDto)) -> Self {
        Self {
            map_id: value.0.map_id,
            user_id: value.0.user_id,
            user_name: value.1.username,
        }
    }
}
