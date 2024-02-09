use chrono::Utc;

use crate::model::entity::MapCollaborator;

use super::NewMapCollaboratorDto;

impl From<NewMapCollaboratorDto> for MapCollaborator {
    fn from(new_map_collaborator: NewMapCollaboratorDto) -> Self {
        Self {
            map_id: new_map_collaborator.map_id,
            user_id: new_map_collaborator.user_id,
            created_at: Utc::now().naive_utc(),
        }
    }
}
