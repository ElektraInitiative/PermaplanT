//! Contains the implementation of [`MapDto`].

use uuid::Uuid;

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
            privacy: map.privacy,
            description: map.description,
            location: map.location.map(From::from),
            owner_id: Uuid::try_parse(&map.owner_id).expect("Could not parse owner id"),
        }
    }
}

impl<T> From<(T, Map)> for MapDto {
    fn from((_, map): (T, Map)) -> Self {
        Self::from(map)
    }
}
