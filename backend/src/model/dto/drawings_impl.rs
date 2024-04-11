use super::drawings::{
    DrawingDto, DrawingVariant, UpdateAddDateDrawingDto, UpdateDrawingsDto,
    UpdateRemoveDateDrawingDto,
};
use crate::model::{
    entity::drawings::{Drawing, UpdateDrawing},
    r#enum::drawing_shape_type::DrawingShapeType,
};

impl DrawingVariant {
    pub fn to_enum_and_json(&self) -> (DrawingShapeType, serde_json::Value) {
        match self {
            DrawingVariant::Rectangle(x) => (
                DrawingShapeType::Rectangle,
                serde_json::to_value(&x).unwrap(),
            ),
            DrawingVariant::Ellipse(x) => {
                (DrawingShapeType::Ellipse, serde_json::to_value(&x).unwrap())
            }
            DrawingVariant::FreeLine(x) => (
                DrawingShapeType::FreeLine,
                serde_json::to_value(&x).unwrap(),
            ),
            DrawingVariant::BezierPolygon(x) => (
                DrawingShapeType::BezierPolygon,
                serde_json::to_value(&x).unwrap(),
            ),
            DrawingVariant::LabelText(x) => (
                DrawingShapeType::LabelText,
                serde_json::to_value(&x).unwrap(),
            ),
            DrawingVariant::Image(x) => {
                (DrawingShapeType::Image, serde_json::to_value(&x).unwrap())
            }
        }
    }
}

impl From<Drawing> for DrawingDto {
    fn from(drawing: Drawing) -> Self {
        let drawing_variant = match drawing.shape_type {
            DrawingShapeType::Rectangle => {
                DrawingVariant::Rectangle(serde_json::from_value(drawing.properties).unwrap())
            }
            DrawingShapeType::Ellipse => {
                DrawingVariant::Ellipse(serde_json::from_value(drawing.properties).unwrap())
            }
            DrawingShapeType::FreeLine => {
                DrawingVariant::FreeLine(serde_json::from_value(drawing.properties).unwrap())
            }
            DrawingShapeType::BezierPolygon => {
                DrawingVariant::BezierPolygon(serde_json::from_value(drawing.properties).unwrap())
            }
            DrawingShapeType::LabelText => {
                DrawingVariant::LabelText(serde_json::from_value(drawing.properties).unwrap())
            }
            DrawingShapeType::Image => {
                DrawingVariant::Image(serde_json::from_value(drawing.properties).unwrap())
            }
        };
        Self {
            id: drawing.id,
            variant: drawing_variant,
            layer_id: drawing.layer_id,
            add_date: drawing.add_date,
            remove_date: drawing.remove_date,
            rotation: drawing.rotation,
            scale_x: drawing.scale_x,
            scale_y: drawing.scale_y,
            x: drawing.x,
            y: drawing.y,
        }
    }
}

impl From<DrawingDto> for Drawing {
    fn from(drawing_dto: DrawingDto) -> Self {
        let (shape_type, properties) = drawing_dto.variant.to_enum_and_json();
        Self {
            id: drawing_dto.id,
            shape_type,
            layer_id: drawing_dto.layer_id,
            add_date: drawing_dto.add_date,
            remove_date: drawing_dto.remove_date,
            rotation: drawing_dto.rotation,
            scale_x: drawing_dto.scale_x,
            scale_y: drawing_dto.scale_y,
            x: drawing_dto.x,
            y: drawing_dto.y,
            properties,
        }
    }
}

impl From<DrawingDto> for UpdateDrawing {
    fn from(drawing_dto: DrawingDto) -> Self {
        let (shape_type, properties) = drawing_dto.variant.to_enum_and_json();
        Self {
            id: drawing_dto.id,
            shape_type: Some(shape_type),
            layer_id: Some(drawing_dto.layer_id),
            add_date: Some(drawing_dto.add_date),
            remove_date: Some(drawing_dto.remove_date),
            rotation: Some(drawing_dto.rotation),
            scale_x: Some(drawing_dto.scale_x),
            scale_y: Some(drawing_dto.scale_y),
            x: Some(drawing_dto.x),
            y: Some(drawing_dto.y),
            properties: Some(properties),
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
