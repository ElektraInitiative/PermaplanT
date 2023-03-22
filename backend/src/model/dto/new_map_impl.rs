use crate::model::entity::NewMap;

use super::NewMapDto;

impl From<NewMapDto> for NewMap {
    fn from(new_map: NewMapDto) -> Self {
        Self {
            detail: new_map.detail,
            created_at: new_map.created_at,
            updated_at: new_map.updated_at,
        }
    }
}
