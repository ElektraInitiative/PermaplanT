//! Contains the implementation of [`SeedDto`].

use crate::model::entity::plantings::{NewPlanting, Planting, UpdatePlanting};

use super::plantings::{NewPlantingDto, PlantingDto, UpdatePlantingDto};

impl From<Planting> for PlantingDto {
    fn from(entity: Planting) -> Self {
        Self {
            id: entity.id,
            plant_id: entity.plant_id,
            layer_id: entity.layer_id,
            x: entity.x,
            y: entity.y,
            width: entity.width,
            height: entity.height,
            rotation: entity.rotation,
            scale_x: entity.scale_x,
            scale_y: entity.scale_y,
        }
    }
}

impl From<NewPlantingDto> for NewPlanting {
    fn from(dto: NewPlantingDto) -> Self {
        Self {
            plant_id: dto.plant_id,
            layer_id: dto.layer_id,
            x: dto.x,
            y: dto.y,
            width: dto.width,
            height: dto.height,
            rotation: dto.rotation,
            scale_x: dto.scale_x,
            scale_y: dto.scale_y,
        }
    }
}

impl From<UpdatePlantingDto> for UpdatePlanting {
    fn from(dto: UpdatePlantingDto) -> Self {
        Self {
            x: dto.x,
            y: dto.y,
            width: dto.width,
            height: dto.height,
            rotation: dto.rotation,
            scale_x: dto.scale_x,
            scale_y: dto.scale_y,
        }
    }
}
