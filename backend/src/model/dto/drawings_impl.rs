use std::collections::HashMap;

use serde::Serialize;
use serde_json::{Map, Value};

use super::drawings::{
    DrawingDto, UpdateAddDateDrawingDto, UpdateDrawingsDto, UpdateRemoveDateDrawingDto,
};
use crate::model::entity::drawings::{Drawing, DrawingJoined};

impl From<DrawingJoined> for DrawingDto {
    fn from(drawing_joined: DrawingJoined) -> Self {
        let properties = if let Some(rectangle) = drawing_joined.rectangle_drawing {
            DrawingProperties::Rectangle(rect)
        } else if let Some(ellipse) = drawing_joined.ellipse_drawing {
            DrawingProperties::Ellipse(ell)
        } else if let Some(freeline) = drawing_joined.freeline_drawing {
            DrawingProperties::FreeLine();
        } else if let Some(polygon) = drawing_joined.polygon_drawing {
            DrawingProperties::PolygonDrawing();
        } else if let Some(labeltext) = drawing_joined.labeltext_drawing {
            DrawingProperties::LabelText();
        } else if let Some(image) = drawing_joined.image_drawing {
            DrawingProperties::Image();
        } else {
            panic!("Bla bla")
        };

        Self {
            id: drawing_joined.drawing.id,
            layer_id: drawing_joined.drawing.layer_id,
            add_date: drawing_joined.drawing.add_date,
            remove_date: drawing_joined.drawing.remove_date,
            rotation: drawing_joined.drawing.rotation,
            scale_x: drawing_joined.drawing.scale_x,
            scale_y: drawing_joined.drawing.scale_y,
            x: drawing_joined.drawing.x,
            y: drawing_joined.drawing.y,
            properties: properties,
        }
    }
}

impl From<Drawing> for DrawingDto {
    fn from(drawing: Drawing) -> Self {
        let shape_type = match drawing.shape_type {
            DrawingShapeType::Rectangle => todo!(),
            DrawingShapeType::Ellipse => todo!(),
            DrawingShapeType::FreeLine => todo!(),
            DrawingShapeType::BezierPolygon => todo!(),
            DrawingShapeType::LabelText => todo!(),
            DrawingShapeType::Image => todo!(),
        };
        Self {
            id: drawing.id,
            shape_type: drawing.shape_type,
            layer_id: drawing.layer_id,
            add_date: drawing.add_date,
            remove_date: drawing.remove_date,
            rotation: drawing.rotation,
            scale_x: drawing.scale_x,
            scale_y: drawing.scale_y,
            x: drawing.x,
            y: drawing.y,
            color: drawing.color,
            fill_pattern: drawing.fill_pattern,
            stroke_width: drawing.stroke_width,
            properties: drawing.properties,
        }
    }
}

impl From<DrawingDto> for Drawing {
    fn from(drawing_dto: DrawingDto) -> Self {
        Self {
            id: drawing_dto.id,
            shape_type: drawing_dto.properties.to_drawing_shape_type(),
            layer_id: drawing_dto.layer_id,
            add_date: drawing_dto.add_date,
            remove_date: drawing_dto.remove_date,
            rotation: drawing_dto.rotation,
            scale_x: drawing_dto.scale_x,
            scale_y: drawing_dto.scale_y,
            x: drawing_dto.x,
            y: drawing_dto.y,
            properties: drawing_dto.properties,
        }
    }
}

impl From<DrawingDto> for UpdateDrawing {
    fn from(drawing_dto: DrawingDto) -> Self {
        Self {
            id: drawing_dto.id,
            shape_type: Some(drawing_dto.properties.to_drawing_shape_type()),
            layer_id: Some(drawing_dto.layer_id),
            add_date: Some(drawing_dto.add_date),
            remove_date: Some(drawing_dto.remove_date),
            rotation: Some(drawing_dto.rotation),
            scale_x: Some(drawing_dto.scale_x),
            scale_y: Some(drawing_dto.scale_y),
            x: Some(drawing_dto.x),
            y: Some(drawing_dto.y),
            properties: drawing_dto.properties,
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
