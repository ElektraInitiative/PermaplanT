//! Contains the implementation of [`PlantsSummaryDto`].

use crate::model::entity::{Plants, Seed};

use super::PlantsSummaryDto;

impl From<Plants> for PlantsSummaryDto {
    fn from(plants: Plants) -> Self {
        Self {
            id: plants.id,
            unique_name: plants.unique_name,
            common_name_en: plants.common_name_en,
            spread: plants.spread,
            additional_name: None,
        }
    }
}

impl From<(Plants, Seed)> for PlantsSummaryDto {
    fn from((plants, seed): (Plants, Seed)) -> Self {
        Self {
            id: plants.id,
            unique_name: plants.unique_name,
            common_name_en: plants.common_name_en,
            spread: plants.spread,
            additional_name: Some(seed.name),
        }
    }
}

impl<T> From<(T, Plants)> for PlantsSummaryDto {
    fn from((_, plants): (T, Plants)) -> Self {
        Self::from(plants)
    }
}
