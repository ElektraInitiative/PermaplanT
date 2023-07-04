//! Contains the implementations related to [`PlantingDto`].

use uuid::Uuid;

use crate::model::entity::BaseLayerImages;

use super::{BaseLayerImagesDto, UpdateBaseLayerImagesDto};

impl From<BaseLayerImages> for BaseLayerImagesDto {
    fn from(entity: BaseLayerImages) -> Self {
        Self {
            id: entity.id,
            layer_id: entity.layer_id,
            path: entity.path,
            rotation: entity.rotation,
            scale: entity.scale,
        }
    }
}

impl From<(Uuid, UpdateBaseLayerImagesDto)> for BaseLayerImages {
    fn from((id, dto): (Uuid, UpdateBaseLayerImagesDto)) -> Self {
        Self {
            id,
            layer_id: dto.layer_id,
            path: dto.path,
            rotation: dto.rotation,
            scale: dto.scale,
        }
    }
}
