//! Contains the implementation of [`BaseLayer`].

use super::BaseLayerDto;
use crate::model::entity::BaseLayer;

impl From<BaseLayer> for BaseLayerDto {
    fn from(base_layer: BaseLayer) -> Self {
        Self {
            id: base_layer.id,
            base_image_url: base_layer.base_image_url,
            pixels_per_meter: base_layer.pixels_per_meter,
            north_orientation_degrees: base_layer.north_orientation_degrees,
        }
    }
}
