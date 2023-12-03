//! Contains the implementation of [`UpdateMapGeometryDto`].

use crate::model::dto::UpdateMapGeometryDto;
use crate::model::entity::UpdateMapGeometry;

impl From<UpdateMapGeometryDto> for UpdateMapGeometry {
    fn from(map_update_geometry: UpdateMapGeometryDto) -> Self {
        Self {
            geometry: map_update_geometry.geometry,
        }
    }
}
