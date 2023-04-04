//! Contains the implementation of [`PlantsSummaryDto`].

use crate::model::entity::Plants;

use super::PlantsSummaryDto;

impl From<Plants> for PlantsSummaryDto {
    fn from(plants: Plants) -> Self {
        Self {
            id: plants.id,
            binomial_name: plants.binomial_name,
            common_name: plants.common_name,
        }
    }
}
