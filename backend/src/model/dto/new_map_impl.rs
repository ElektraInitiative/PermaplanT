//! Contains the implementation of [`NewMapDto`].

use postgis_diesel::types::Point;

use crate::model::entity::NewMap;

use super::NewMapDto;

impl From<NewMapDto> for NewMap {
    fn from(new_map: NewMapDto) -> Self {
        Self {
            name: new_map.name,
            creation_date: new_map.creation_date,
            deletion_date: new_map.deletion_date,
            last_visit: new_map.last_visit,
            is_inactive: new_map.is_inactive,
            zoom_factor: new_map.zoom_factor,
            honors: new_map.honors,
            visits: new_map.visits,
            harvested: new_map.harvested,
            owner_id: new_map.owner_id,
            is_private: new_map.is_private,
            description: new_map.description,
            location: match new_map.location {
                Some(latlng) => Some(Point {
                    x: latlng.lng,
                    y: latlng.lat,
                    srid: Some(4326),
                }),
                None => None,
            },
        }
    }
}
