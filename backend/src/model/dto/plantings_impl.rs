//! Contains the implementations related to [`PlantingDto`].

//use chrono::Utc;
use uuid::Uuid;

use crate::model::entity::plantings::{Planting, UpdatePlanting};

use super::plantings::{NewPlantingDto, PlantingDto, UpdatePlantingDto};

impl From<(Planting, Option<String>)> for PlantingDto {
    fn from((planting, additional_name): (Planting, Option<String>)) -> Self {
        Self {
            additional_name,
            ..planting.into()
        }
    }
}

impl From<Planting> for PlantingDto {
    fn from(planting: Planting) -> Self {
        Self {
            id: planting.id,
            plant_id: planting.plant_id,
            layer_id: planting.layer_id,
            x: planting.x,
            y: planting.y,
            width: planting.width,
            height: planting.height,
            rotation: planting.rotation,
            scale_x: planting.scale_x,
            scale_y: planting.scale_y,
            add_date: planting.add_date,
            remove_date: planting.remove_date,
            seed_id: planting.seed_id,
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
