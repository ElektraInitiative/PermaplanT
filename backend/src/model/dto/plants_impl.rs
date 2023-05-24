//! Contains the implementation of [`PlantsSummaryDto`].

use crate::model::entity::Plants;

use super::PlantsSummaryDto;

impl From<Plants> for PlantsSummaryDto {
    fn from(plants: Plants) -> Self {
        Self {
            id: plants.id,
            unique_name: plants.unique_name,
            common_name_en: plants.common_name_en,
        }
    }
}

impl From<(Plants, f32)> for PlantsSummaryDto {
    fn from((plants, _): (Plants, f32)) -> Self {
        Self {
            id: plants.id,
            unique_name: plants.unique_name,
            common_name_en: plants.common_name_en,
        }
    }
}
