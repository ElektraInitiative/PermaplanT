use super::drawings::{
    DrawingDto, UpdateAddDateDrawingDto, UpdateDrawingsDto, UpdateRemoveDateDrawingDto,
};
use crate::model::entity::drawings::{Drawing, UpdateDrawing};

impl From<Drawing> for DrawingDto {
    fn from(drawing: Drawing) -> Self {
        Self {
            id: drawing.id,
            kind: drawing.kind,
            layer_id: drawing.layer_id,
            add_date: drawing.add_date,
            remove_date: drawing.remove_date,
            rotation: drawing.rotation,
            scale_x: drawing.scale_x,
            scale_y: drawing.scale_y,
            x: drawing.x,
            y: drawing.y,
            color: drawing.color,
            fill_enabled: drawing.fill_enabled,
            stroke_width: drawing.stroke_width,
            properties: drawing.properties,
        }
    }
}

impl From<DrawingDto> for Drawing {
    fn from(drawing_dto: DrawingDto) -> Self {
        Self {
            id: drawing_dto.id,
            kind: drawing_dto.kind,
            layer_id: drawing_dto.layer_id,
            add_date: drawing_dto.add_date,
            remove_date: drawing_dto.remove_date,
            rotation: drawing_dto.rotation,
            scale_x: drawing_dto.scale_x,
            scale_y: drawing_dto.scale_y,
            x: drawing_dto.x,
            y: drawing_dto.y,
            color: drawing_dto.color,
            fill_enabled: drawing_dto.fill_enabled,
            stroke_width: drawing_dto.stroke_width,
            properties: drawing_dto.properties,
        }
    }
}

impl From<DrawingDto> for UpdateDrawing {
    fn from(drawing_dto: DrawingDto) -> Self {
        Self {
            id: drawing_dto.id,
            kind: Some(drawing_dto.kind),
            layer_id: Some(drawing_dto.layer_id),
            add_date: Some(drawing_dto.add_date),
            remove_date: Some(drawing_dto.remove_date),
            rotation: Some(drawing_dto.rotation),
            scale_x: Some(drawing_dto.scale_x),
            scale_y: Some(drawing_dto.scale_y),
            x: Some(drawing_dto.x),
            y: Some(drawing_dto.y),
            color: Some(drawing_dto.color),
            fill_enabled: Some(drawing_dto.fill_enabled),
            stroke_width: Some(drawing_dto.stroke_width),
            properties: Some(drawing_dto.properties),
        }
    }
}

impl From<UpdateAddDateDrawingDto> for UpdateDrawing {
    fn from(dto: UpdateAddDateDrawingDto) -> Self {
        Self {
            id: dto.id,
            add_date: Some(dto.add_date),
            ..Default::default()
        }
    }
}

impl From<UpdateRemoveDateDrawingDto> for UpdateDrawing {
    fn from(dto: UpdateRemoveDateDrawingDto) -> Self {
        Self {
            id: dto.id,
            remove_date: Some(dto.remove_date),
            ..Default::default()
        }
    }
}

impl From<UpdateDrawingsDto> for Vec<UpdateDrawing> {
    fn from(dto: UpdateDrawingsDto) -> Self {
        match dto {
            UpdateDrawingsDto::Update(vec) => vec.into_iter().map(Into::into).collect(),
            UpdateDrawingsDto::UpdateAddDate(vec) => vec.into_iter().map(Into::into).collect(),
            UpdateDrawingsDto::UpdateRemoveDate(vec) => vec.into_iter().map(Into::into).collect(),
        }
    }
}
