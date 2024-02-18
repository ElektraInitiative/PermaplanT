//! Contains the implementations related to [`PlantingDto`].

//use chrono::Utc;
use uuid::Uuid;

use crate::model::entity::plantings::{Planting, UpdatePlanting};

use super::plantings::{
    MovePlantingDto, NewPlantingDto, PlantingDto, TransformPlantingDto, UpdateAddDatePlantingDto,
    UpdatePlantingDto, UpdatePlantingNoteDto, UpdateRemoveDatePlantingDto,
};

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
            size_x: planting.size_x,
            size_y: planting.size_y,
            rotation: planting.rotation,
            add_date: planting.add_date,
            remove_date: planting.remove_date,
            seed_id: planting.seed_id,
            is_area: planting.is_area,
            additional_name: None,
            planting_notes: planting.notes,
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
            size_x: dto.size_x,
            size_y: dto.size_y,
            rotation: dto.rotation,
            add_date: dto.add_date,
            remove_date: None,
            seed_id: dto.seed_id,
            is_area: dto.is_area,
            //create_date: Utc::now().date_naive(),
            //delete_date: None,
            notes: None,
        }
    }
}

impl From<TransformPlantingDto> for UpdatePlanting {
    fn from(dto: TransformPlantingDto) -> Self {
        Self {
            id: dto.id,
            x: Some(dto.x),
            y: Some(dto.y),
            rotation: Some(dto.rotation),
            size_x: Some(dto.size_x),
            size_y: Some(dto.size_y),
            ..Default::default()
        }
    }
}

impl From<MovePlantingDto> for UpdatePlanting {
    fn from(dto: MovePlantingDto) -> Self {
        Self {
            id: dto.id,
            x: Some(dto.x),
            y: Some(dto.y),
            ..Default::default()
        }
    }
}

impl From<UpdateAddDatePlantingDto> for UpdatePlanting {
    fn from(dto: UpdateAddDatePlantingDto) -> Self {
        Self {
            id: dto.id,
            add_date: Some(dto.add_date),
            ..Default::default()
        }
    }
}

impl From<UpdateRemoveDatePlantingDto> for UpdatePlanting {
    fn from(dto: UpdateRemoveDatePlantingDto) -> Self {
        Self {
            id: dto.id,
            remove_date: Some(dto.remove_date),
            ..Default::default()
        }
    }
}

impl From<UpdatePlantingNoteDto> for UpdatePlanting {
    fn from(dto: UpdatePlantingNoteDto) -> Self {
        Self {
            id: dto.id,
            notes: Some(dto.notes),
            ..Default::default()
        }
    }
}

impl From<UpdatePlantingDto> for Vec<UpdatePlanting> {
    fn from(dto: UpdatePlantingDto) -> Self {
        match dto {
            UpdatePlantingDto::Transform(vec) => vec.into_iter().map(Into::into).collect(),
            UpdatePlantingDto::Move(vec) => vec.into_iter().map(Into::into).collect(),
            UpdatePlantingDto::UpdateAddDate(vec) => vec.into_iter().map(Into::into).collect(),
            UpdatePlantingDto::UpdateRemoveDate(vec) => vec.into_iter().map(Into::into).collect(),
            UpdatePlantingDto::UpdateNote(vec) => vec.into_iter().map(Into::into).collect(),
        }
    }
}
