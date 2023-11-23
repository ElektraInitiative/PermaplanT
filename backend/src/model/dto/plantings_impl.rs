//! Contains the implementations related to [`PlantingDto`].

//use chrono::Utc;
use uuid::Uuid;

use crate::model::entity::plantings::{Planting, UpdatePlanting};

use super::plantings::{NewPlantingDto, PlantingDto, UpdatePlantingDto};

impl From<(Planting, Option<String>)> for PlantingDto {
    fn from(entities: (Planting, Option<String>)) -> Self {
        Self {
            id: entities.0.id,
            plant_id: entities.0.plant_id,
            layer_id: entities.0.layer_id,
            x: entities.0.x,
            y: entities.0.y,
            width: entities.0.width,
            height: entities.0.height,
            rotation: entities.0.rotation,
            scale_x: entities.0.scale_x,
            scale_y: entities.0.scale_y,
            add_date: entities.0.add_date,
            remove_date: entities.0.remove_date,
            seed_id: entities.0.seed_id,
            additional_name: entities.1,
        }
    }
}

impl From<Planting> for PlantingDto {
    fn from(entities: Planting) -> Self {
        Self {
            id: entities.id,
            plant_id: entities.plant_id,
            layer_id: entities.layer_id,
            x: entities.x,
            y: entities.y,
            width: entities.width,
            height: entities.height,
            rotation: entities.rotation,
            scale_x: entities.scale_x,
            scale_y: entities.scale_y,
            add_date: entities.add_date,
            remove_date: entities.remove_date,
            seed_id: entities.seed_id,
            additional_name: None,
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
