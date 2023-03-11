//! [`PlantsDTO`] and its implementation.

use crate::models::entity::Plants;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[allow(clippy::missing_docs_in_private_items)] // TODO: document
#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct PlantsDTO {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub plant: Option<String>,
    pub plant_type: Option<i32>,
}

impl From<Plants> for PlantsDTO {
    fn from(plants: Plants) -> Self {
        Self {
            id: plants.id,
            tags: plants.tags,
            species: plants.species,
            plant: plants.plant,
            plant_type: plants.plant_type,
        }
    }
}
