//! Contains the implementation of [`LayerDto`].

use crate::model::entity::Layer;

use super::LayerDto;

impl From<Layer> for LayerDto {
    fn from(layer: Layer) -> Self {
        Self {
            id: layer.id,
            map_id: layer.map_id,
            type_: layer.type_,
            name: layer.name,
            is_alternative: layer.is_alternative,
        }
    }
}
