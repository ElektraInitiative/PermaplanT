//! Contains the implementation of [`GainedBlossoms`].

use uuid::Uuid;

use crate::model::entity::GainedBlossoms;

use super::GainedBlossomsDto;

impl From<(GainedBlossomsDto, Uuid)> for GainedBlossoms {
    fn from((gained_blossom, user_id): (GainedBlossomsDto, Uuid)) -> Self {
        Self {
            user_id,
            blossom: gained_blossom.blossom,
            times_gained: gained_blossom.times_gained,
            gained_date: gained_blossom.gained_date,
        }
    }
}

impl From<GainedBlossoms> for GainedBlossomsDto {
    fn from(gained_blossom: GainedBlossoms) -> Self {
        Self {
            blossom: gained_blossom.blossom,
            times_gained: gained_blossom.times_gained,
            gained_date: gained_blossom.gained_date,
        }
    }
}
