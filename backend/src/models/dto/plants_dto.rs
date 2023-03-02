use crate::models::plants::Plants;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct PlantsDTO {
    pub id: i32,
    pub tags: Vec<Option<String>>,
    pub species: String,
    pub plant: Option<String>,
}

impl From<Plants> for PlantsDTO {
    fn from(plants: Plants) -> Self {
        Self {
            id: plants.id,
            tags: plants.tags,
            species: plants.species,
            plant: plants.plant,
        }
    }
}
