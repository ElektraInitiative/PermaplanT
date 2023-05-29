//! Contains the implementation of [`MapDto`].

use crate::model::entity::Map;

use super::MapDto;

impl From<Map> for MapDto {
    fn from(map: Map) -> Self {
        Self {
            id: map.id,
            name: map.name,
            creation_date: map.creation_date,
            deletion_date: map.deletion_date,
            last_visit: map.last_visit,
            is_inactive: map.is_inactive,
            zoom_factor: map.zoom_factor,
            honors: map.honors,
            visits: map.visits,
            harvested: map.harvested,
            owner_id: map.owner_id,
            is_private: map.is_private,
            description: map.description,
        }
    }
}
