//! Contains the implementation of [`MapDto`].

use crate::model::entity::Map;

use super::MapDto;

impl From<Map> for MapDto {
    fn from(map: Map) -> Self {
        Self {
            id: map.id,
            name: map.name,
            created_at: map.created_at,
            modified_at: map.modified_at,
            created_by: map.created_by,
            modified_by: map.modified_by,
            deletion_date: map.deletion_date,
            last_visit: map.last_visit,
            is_inactive: map.is_inactive,
            zoom_factor: map.zoom_factor,
            honors: map.honors,
            visits: map.visits,
            harvested: map.harvested,
            privacy: map.privacy,
            description: map.description,
            location: map.location.map(From::from),
            geometry: map.geometry,
        }
    }
}

impl<T> From<(T, Map)> for MapDto {
    fn from((_, map): (T, Map)) -> Self {
        Self::from(map)
    }
}
