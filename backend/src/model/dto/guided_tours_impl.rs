//! Contains the implementation of [`GuidedToursDto`].

use uuid::Uuid;

use crate::model::entity::{GuidedTours, UpdateGuidedTours};

use super::{GuidedToursDto, UpdateGuidedToursDto};

impl From<GuidedTours> for GuidedToursDto {
    fn from(guided_tours: GuidedTours) -> Self {
        Self {
            editor_tour_completed: guided_tours.editor_tour_completed,
        }
    }
}

impl From<Uuid> for GuidedTours {
    fn from(user_id: Uuid) -> Self {
        Self {
            user_id,
            editor_tour_completed: false,
        }
    }
}

impl From<UpdateGuidedToursDto> for UpdateGuidedTours {
    fn from(update_object: UpdateGuidedToursDto) -> Self {
        Self {
            editor_tour_completed: update_object.editor_tour_completed,
        }
    }
}
