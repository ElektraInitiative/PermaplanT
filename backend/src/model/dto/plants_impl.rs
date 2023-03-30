//! Contains the implementation of [`PlantsDto`].

use crate::model::entity::Plants;

use super::PlantsSearchDto;

impl From<Plants> for PlantsSearchDto {
    fn from(plants: Plants) -> Self {
        Self {
            id: plants.id,
            binomial_name: plants.binomial_name,
            common_name: plants.common_name,
        }
    }
}
