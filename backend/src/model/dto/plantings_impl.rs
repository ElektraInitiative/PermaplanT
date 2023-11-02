//! Contains the implementations related to [`PlantingDto`].

//use chrono::Utc;
use uuid::Uuid;

use crate::model::entity::plantings::{Planting, UpdatePlanting};

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
            add_date: entity.add_date,
            remove_date: entity.remove_date,
            seed_id: entity.seed_id,
        }
    }
}

impl From<NewPlantingDto> for Planting {
    fn from(dto: NewPlantingDto) -> Self {
        Self {
            id: dto.id.unwrap_or_else(Uuid::new_v4),
            plant_id: dto.plant_id,
            layer_id: dto.layer_id,
            x: dto.x,
            y: dto.y,
            width: dto.width,
            height: dto.height,
            rotation: dto.rotation,
            scale_x: dto.scale_x,
            scale_y: dto.scale_y,
            add_date: dto.add_date,
            remove_date: None,
            seed_id: dto.seed_id,
            //create_date: Utc::now().date_naive(),
            //delete_date: None,
        }
    }
}

impl From<UpdatePlantingDto> for UpdatePlanting {
    fn from(dto: UpdatePlantingDto) -> Self {
        match dto {
            UpdatePlantingDto::Transform(dto) => Self {
                x: Some(dto.x),
                y: Some(dto.y),
                rotation: Some(dto.rotation),
                scale_x: Some(dto.scale_x),
                scale_y: Some(dto.scale_y),
                ..Default::default()
            },
            UpdatePlantingDto::Move(dto) => Self {
                x: Some(dto.x),
                y: Some(dto.y),
                ..Default::default()
            },
            UpdatePlantingDto::UpdateAddDate(dto) => Self {
                add_date: Some(dto.add_date),
                ..Default::default()
            },
            UpdatePlantingDto::UpdateRemoveDate(dto) => Self {
                remove_date: Some(dto.remove_date),
                ..Default::default()
            },
        }
    }
}
