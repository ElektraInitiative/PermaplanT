//! Contains the implementation of [`LayerDto`].

use crate::model::dto::layers::{LayerDto, NewLayerDto};
use crate::model::entity::layers::NewLayer;
use crate::model::entity::layers::{Layer, UpdateLayerName};

use super::layers::LayerRenameDto;

impl From<Layer> for LayerDto {
    fn from(layer: Layer) -> Self {
        Self {
            id: layer.id,
            map_id: layer.map_id,
            type_: layer.type_,
            name: layer.name,
            is_alternative: layer.is_alternative,
            order_index: layer.order_index,
        }
    }
}

impl From<(i32, NewLayerDto)> for NewLayer {
    fn from(tuple: (i32, NewLayerDto)) -> Self {
        Self {
            map_id: tuple.0,
            type_: tuple.1.type_,
            name: tuple.1.name,
            is_alternative: tuple.1.is_alternative,
        }
    }
}

impl From<LayerRenameDto> for UpdateLayerName {
    fn from(dto: LayerRenameDto) -> Self {
        Self {
            id: dto.id,
            name: dto.name,
        }
    }
}
