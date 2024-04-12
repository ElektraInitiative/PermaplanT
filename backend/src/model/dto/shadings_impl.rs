//! Contains the implementations related to [`ShadingDto`].

use crate::model::dto::shadings::{
    UpdateAddDateShadingDto, UpdateRemoveDateShadingDto, UpdateValuesShadingDto,
};
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

impl From<UpdateShadingDto> for Vec<UpdateShading> {
    fn from(dto: UpdateShadingDto) -> Self {
        match dto {
            UpdateShadingDto::Update(vec) => vec.into_iter().map(Into::into).collect(),
            UpdateShadingDto::UpdateAddDate(vec) => vec.into_iter().map(Into::into).collect(),
            UpdateShadingDto::UpdateRemoveDate(vec) => vec.into_iter().map(Into::into).collect(),
        }
    }
}

impl From<UpdateValuesShadingDto> for UpdateShading {
    fn from(dto: UpdateValuesShadingDto) -> Self {
        Self {
            id: dto.id,
            shade: dto.shade,
            geometry: dto.geometry,
            add_date: None,
            remove_date: None,
        }
    }
}

impl From<UpdateAddDateShadingDto> for UpdateShading {
    fn from(dto: UpdateAddDateShadingDto) -> Self {
        Self {
            id: dto.id,
            shade: None,
            geometry: None,
            add_date: Some(dto.add_date),
            remove_date: None,
        }
    }
}

impl From<UpdateRemoveDateShadingDto> for UpdateShading {
    fn from(dto: UpdateRemoveDateShadingDto) -> Self {
        Self {
            id: dto.id,
            shade: None,
            geometry: None,
            add_date: None,
            remove_date: Some(dto.remove_date),
        }
    }
}
