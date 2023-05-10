//! Contains the implementation of [`NewMapVersionDto`].

use crate::model::entity::NewMapVersion;

use super::NewMapVersionDto;

impl From<NewMapVersionDto> for NewMapVersion {
    fn from(new_map_version: NewMapVersionDto) -> Self {
        Self {
            map_id: new_map_version.map_id,
            version_name: new_map_version.version_name,
            snapshot_date: new_map_version.snapshot_date,
        }
    }
}
