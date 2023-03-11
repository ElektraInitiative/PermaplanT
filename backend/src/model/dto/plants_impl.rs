//! Contains the implementation of [`PlantsDto`].

use crate::model::entity::Plants;

use super::PlantsDto;

impl From<Plants> for PlantsDto {
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
