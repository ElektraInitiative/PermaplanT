//! Contains the implementations related to [`BaseLayerImageDto`].

use uuid::Uuid;

use crate::model::entity::BaseLayerImages;

use super::{BaseLayerImageDto, UpdateBaseLayerImageDto};

impl From<BaseLayerImages> for BaseLayerImageDto {
    fn from(entity: BaseLayerImages) -> Self {
        Self {
            id: entity.id,
            layer_id: entity.layer_id,
            path: entity.path,
            rotation: entity.rotation,
            scale: entity.scale,
            action_id: Uuid::nil(),
        }
    }
}

impl From<(Uuid, UpdateBaseLayerImageDto)> for BaseLayerImages {
    fn from((id, dto): (Uuid, UpdateBaseLayerImageDto)) -> Self {
        Self {
            id,
            layer_id: dto.layer_id,
            path: dto.path,
            rotation: dto.rotation,
            scale: dto.scale,
        }
    }
}

impl From<BaseLayerImageDto> for BaseLayerImages {
    fn from(dto: BaseLayerImageDto) -> Self {
        Self {
            id: dto.id,
            layer_id: dto.layer_id,
            path: dto.path,
            rotation: dto.rotation,
            scale: dto.scale,
        }
    }
}
