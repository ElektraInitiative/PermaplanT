//! Contains the implementation of [`NewMapDto`].

use uuid::Uuid;

use crate::model::entity::NewMap;

use super::NewMapDto;

impl From<(NewMapDto, Uuid)> for NewMap {
    fn from((new_map, user_id): (NewMapDto, Uuid)) -> Self {
        Self {
            name: new_map.name,
            deletion_date: new_map.deletion_date,
            last_visit: new_map.last_visit,
            is_inactive: new_map.is_inactive,
            zoom_factor: new_map.zoom_factor,
            honors: new_map.honors,
            visits: new_map.visits,
            harvested: new_map.harvested,
            privacy: new_map.privacy,
            description: new_map.description,
            location: new_map.location.map(From::from),
            created_by: user_id,
            modified_by: user_id,
            geometry: new_map.geometry,
        }
    }
}
