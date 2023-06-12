//! Contains the implementation of [`NewMapDto`].

use uuid::Uuid;

use crate::model::entity::NewMap;

use super::NewMapDto;

impl From<(NewMapDto, Uuid)> for NewMap {
    fn from(input_data: (NewMapDto, Uuid)) -> Self {
        Self {
            name: input_data.0.name,
            creation_date: input_data.0.creation_date,
            deletion_date: input_data.0.deletion_date,
            last_visit: input_data.0.last_visit,
            is_inactive: input_data.0.is_inactive,
            zoom_factor: input_data.0.zoom_factor,
            honors: input_data.0.honors,
            visits: input_data.0.visits,
            harvested: input_data.0.harvested,
            privacy: input_data.0.privacy,
            description: input_data.0.description,
            location: input_data.0.location.map(From::from),
            owner_id: input_data.1.to_string(),
        }
    }
}
