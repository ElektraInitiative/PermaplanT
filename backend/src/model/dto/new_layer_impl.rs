//! Contains the implementation of [`NewLayerDto`].

use crate::model::entity::NewLayer;

use super::NewLayerDto;

impl From<NewLayerDto> for NewLayer {
    fn from(new_layer: NewLayerDto) -> Self {
        Self {
            map_id: new_layer.map_id,
            type_: new_layer.type_,
            name: new_layer.name,
            is_alternative: new_layer.is_alternative,
        }
    }
}
