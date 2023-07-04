//! Contains the implementation of [`UpdateMapDto`].

use crate::model::entity::UpdateMap;

use super::UpdateMapDto;

impl From<UpdateMapDto> for UpdateMap {
    fn from(map_update: UpdateMapDto) -> Self {
        Self {
            name: map_update.name,
            privacy: map_update.privacy,
            description: map_update.description,
            location: map_update.location.map(From::from),
        }
    }
}
