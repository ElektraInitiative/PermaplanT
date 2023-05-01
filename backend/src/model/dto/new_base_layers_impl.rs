//! Contains the implementation of [`NewBaseLayer`].

use super::NewBaseLayerDto;
use crate::model::entity::NewBaseLayer;

impl From<NewBaseLayerDto> for NewBaseLayer {
    fn from(bew_base_layer: NewBaseLayerDto) -> Self {
        Self {
            base_image_url: bew_base_layer.base_image_url,
            pixels_per_meter: bew_base_layer.pixels_per_meter,
            north_orientation_degrees: bew_base_layer.north_orientation_degrees,
        }
    }
}
