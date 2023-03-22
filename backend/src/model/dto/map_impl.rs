use crate::model::entity::Map;

use super::MapDto;

impl From<Map> for MapDto {
    fn from(map: Map) -> Self {
        Self {
            id: map.id,
            detail: map.detail,
            created_at: map.created_at,
            updated_at: map.updated_at,
        }
    }
}

