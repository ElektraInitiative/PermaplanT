//! Contains the implementations related to [`ShadingDto`].

use uuid::Uuid;

use crate::model::entity::shadings::{Shading, UpdateShading};

use super::shadings::{NewShadingDto, ShadingDto, UpdateShadingDto};

impl From<Shading> for ShadingDto {
    fn from(entity: Shading) -> Self {
        Self {
            id: entity.id,
            layer_id: entity.layer_id,
            shade: entity.shade,
            geometry: entity.geometry,
            add_date: entity.add_date,
            remove_date: entity.remove_date,
        }
    }
}

impl From<NewShadingDto> for Shading {
    fn from(dto: NewShadingDto) -> Self {
        Self {
            id: dto.id.unwrap_or_else(Uuid::new_v4),
            layer_id: dto.layer_id,
            shade: dto.shade,
            geometry: dto.geometry,
            add_date: dto.add_date,
            remove_date: None,
        }
    }
}

impl From<UpdateShadingDto> for UpdateShading {
    fn from(dto: UpdateShadingDto) -> Self {
        match dto {
            UpdateShadingDto::Update(dto) => Self {
                shade: dto.shade,
                geometry: dto.geometry,
                ..Default::default()
            },
            UpdateShadingDto::UpdateAddDate(dto) => Self {
                add_date: Some(dto.add_date),
                ..Default::default()
            },
            UpdateShadingDto::UpdateRemoveDate(dto) => Self {
                remove_date: Some(dto.remove_date),
                ..Default::default()
            },
        }
    }
}
