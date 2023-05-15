//! Contains the implementation of [`MapVersionDto`].

use crate::model::entity::MapVersion;

use super::MapVersionDto;

impl From<MapVersion> for MapVersionDto {
    fn from(map_version: MapVersion) -> Self {
        Self {
            id: map_version.id,
            map_id: map_version.map_id,
            version_name: map_version.version_name,
            snapshot_date: map_version.snapshot_date,
        }
    }
}
