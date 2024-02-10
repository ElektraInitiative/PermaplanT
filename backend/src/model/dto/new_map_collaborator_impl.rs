use chrono::Utc;

use crate::model::entity::MapCollaborator;

use super::NewMapCollaboratorDto;

impl From<(i32, NewMapCollaboratorDto)> for MapCollaborator {
    fn from(map_and_collaborator: (i32, NewMapCollaboratorDto)) -> Self {
        let (map_id, new_map_collaborator) = map_and_collaborator;
        Self {
            map_id,
            user_id: new_map_collaborator.user_id,
            created_at: Utc::now().naive_utc(),
        }
    }
}
