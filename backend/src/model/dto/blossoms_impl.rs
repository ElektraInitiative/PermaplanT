//! Contains the implementation of [`BlossomsGained`].

use uuid::Uuid;

use crate::model::entity::BlossomsGained;

use super::BlossomsGainedDto;

impl From<(BlossomsGainedDto, Uuid)> for BlossomsGained {
    fn from((gained_blossom, user_id): (BlossomsGainedDto, Uuid)) -> Self {
        Self {
            user_id,
            blossom: gained_blossom.blossom,
            times_gained: gained_blossom.times_gained,
            gained_date: gained_blossom.gained_date,
        }
    }
}

impl From<BlossomsGained> for BlossomsGainedDto {
    fn from(gained_blossom: BlossomsGained) -> Self {
        Self {
            blossom: gained_blossom.blossom,
            times_gained: gained_blossom.times_gained,
            gained_date: gained_blossom.gained_date,
        }
    }
}
